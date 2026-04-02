// Netlify serverless function: generate-transits.js
// Runs once a year (triggered by GitHub Action every September 1st)
// Calls Astrologer API for every day of the next calendar year
// Calculates aspects between all planet pairs
// Saves results to public/transits-data.json

const https = require("https");
const fs = require("fs");
const path = require("path");

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
const RAPIDAPI_HOST = "astrologer.p.rapidapi.com";

const PLANETS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

const ASPECTS = [
  { name: "conjunction", symbol: "☌", degrees: 0,   orb: 8  },
  { name: "sextile",     symbol: "⚹", degrees: 60,  orb: 6  },
  { name: "square",      symbol: "□", degrees: 90,  orb: 8  },
  { name: "trine",       symbol: "△", degrees: 120, orb: 8  },
  { name: "opposition",  symbol: "☍", degrees: 180, orb: 8  },
];

// Moon signs in order
const SIGNS = [
  "aries","taurus","gemini","cancer","leo","virgo",
  "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
];

const SIGN_SYMBOLS = {
  aries:"♈", taurus:"♉", gemini:"♊", cancer:"♋", leo:"♌", virgo:"♍",
  libra:"♎", scorpio:"♏", sagittarius:"♐", capricorn:"♑", aquarius:"♒", pisces:"♓"
};

const PLANET_SYMBOLS = {
  sun:"☉", moon:"☽", mercury:"☿", venus:"♀", mars:"♂",
  jupiter:"♃", saturn:"♄", uranus:"♅", neptune:"♆", pluto:"♇"
};

// Outer planets move so slowly their aspects last weeks/months
// We only record them when they are exact (within tighter orb)
const OUTER_PLANETS = ["jupiter", "saturn", "uranus", "neptune", "pluto"];
const INNER_PLANETS = ["sun", "moon", "mercury", "venus", "mars"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function angleDiff(a, b) {
  let diff = Math.abs(a - b) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function checkAspects(planets) {
  const aspects = [];
  const planetKeys = Object.keys(planets);

  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const p1 = planetKeys[i];
      const p2 = planetKeys[j];
      const pos1 = planets[p1].position;
      const pos2 = planets[p2].position;

      if (pos1 === null || pos2 === null) continue;

      const diff = angleDiff(pos1, pos2);

      for (const aspect of ASPECTS) {
        const orb = Math.abs(diff - aspect.degrees);
        // Use tighter orb for outer planet pairs (they move slowly)
        const maxOrb = (OUTER_PLANETS.includes(p1) && OUTER_PLANETS.includes(p2))
          ? 3 : aspect.orb;

        if (orb <= maxOrb) {
          aspects.push({
            planet1: p1,
            planet2: p2,
            aspect: aspect.name,
            symbol: aspect.symbol,
            orb: Math.round(orb * 10) / 10,
            sign1: planets[p1].sign,
            sign2: planets[p2].sign,
          });
        }
      }
    }
  }
  return aspects;
}

function getMoonPhase(illumination, waxing) {
  if (illumination < 2)  return "new";
  if (illumination < 48) return waxing ? "waxing_crescent" : "waning_crescent";
  if (illumination < 52) return waxing ? "first_quarter" : "last_quarter";
  if (illumination < 98) return waxing ? "waxing_gibbous" : "waning_gibbous";
  return "full";
}

function isKeyMoonPhase(phase) {
  return ["new", "first_quarter", "full", "last_quarter"].includes(phase);
}

// ─── API CALLS ───────────────────────────────────────────────────────────────

function apiPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: RAPIDAPI_HOST,
      path: endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`JSON parse error: ${body.slice(0, 200)}`));
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function getPlanetPositions(year, month, day) {
  const result = await apiPost("/api/v5/now/subject", {
    year, month, day,
    hour: 12, minute: 0,
    longitude: -122.4194,
    latitude: 37.7749,
    timezone: "America/Los_Angeles",
  });

  const planets = {};
  const subjectPlanets = result.subject?.planets || result.planets || [];

  for (const planet of subjectPlanets) {
    const name = planet.name?.toLowerCase();
    if (PLANETS.includes(name)) {
      planets[name] = {
        position: planet.position ?? planet.abs_pos ?? null,
        sign: planet.sign?.toLowerCase() ?? planet.sign_name?.toLowerCase() ?? null,
        retrograde: planet.retrograde ?? false,
      };
    }
  }
  return planets;
}

async function getMoonPhaseData(year, month, day) {
  const result = await apiPost("/api/v5/moon-phase", {
    year, month, day,
    hour: 12, minute: 0,
    longitude: -122.4194,
    latitude: 37.7749,
    timezone: "America/Los_Angeles",
  });

  return {
    illumination: result.illumination ?? result.moon_illumination ?? null,
    phase: result.phase ?? result.moon_phase ?? null,
    sign: result.sign?.toLowerCase() ?? result.moon_sign?.toLowerCase() ?? null,
    waxing: result.waxing ?? (result.phase_name?.toLowerCase()?.includes("waxing")) ?? null,
  };
}

// ─── MAIN GENERATION ─────────────────────────────────────────────────────────

async function generateYearData(year) {
  console.log(`Generating transit data for ${year}...`);

  const calendarData = {};
  let previousMoonSign = null;

  // Loop every day of the year
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    calendarData[monthKey] = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      console.log(`Processing ${dateKey}...`);

      try {
        // Fetch planet positions and moon phase in parallel
        const [planets, moonData] = await Promise.all([
          getPlanetPositions(year, month, day),
          getMoonPhaseData(year, month, day),
        ]);

        // Calculate aspects
        const aspects = checkAspects(planets);

        // Determine moon phase
        const phaseKey = moonData.phase
          ? moonData.phase.toLowerCase().replace(" ", "_")
          : getMoonPhase(moonData.illumination || 0, moonData.waxing ?? true);

        // Detect moon sign change (ingress)
        const moonSign = planets.moon?.sign || moonData.sign;
        const moonIngress = moonSign && moonSign !== previousMoonSign ? moonSign : null;
        if (moonSign) previousMoonSign = moonSign;

        // Find retrograde planets
        const retrogrades = PLANETS.filter(p => planets[p]?.retrograde).map(p => ({
          planet: p,
          symbol: PLANET_SYMBOLS[p],
        }));

        calendarData[monthKey][day] = {
          date: dateKey,
          moon: {
            sign: moonSign,
            sign_symbol: moonSign ? SIGN_SYMBOLS[moonSign] : null,
            phase: phaseKey,
            illumination: moonData.illumination,
            is_key_phase: isKeyMoonPhase(phaseKey),
            ingress: moonIngress,
          },
          planets: Object.fromEntries(
            PLANETS.map(p => [p, {
              sign: planets[p]?.sign || null,
              sign_symbol: planets[p]?.sign ? SIGN_SYMBOLS[planets[p].sign] : null,
              retrograde: planets[p]?.retrograde || false,
            }])
          ),
          aspects: aspects.map(a => ({
            planet1: a.planet1,
            planet2: a.planet2,
            planet1_symbol: PLANET_SYMBOLS[a.planet1],
            planet2_symbol: PLANET_SYMBOLS[a.planet2],
            aspect: a.aspect,
            aspect_symbol: a.symbol,
            sign1: a.sign1,
            sign2: a.sign2,
            sign1_symbol: a.sign1 ? SIGN_SYMBOLS[a.sign1] : null,
            sign2_symbol: a.sign2 ? SIGN_SYMBOLS[a.sign2] : null,
            label: `${PLANET_SYMBOLS[a.planet1]} ${a.planet1.charAt(0).toUpperCase() + a.planet1.slice(1)} ${a.symbol} ${PLANET_SYMBOLS[a.planet2]} ${a.planet2.charAt(0).toUpperCase() + a.planet2.slice(1)}`,
          })),
          retrogrades,
        };

        // Rate limiting -- be nice to the API
        await sleep(300);

      } catch (err) {
        console.error(`Error on ${dateKey}:`, err.message);
        calendarData[monthKey][day] = { date: dateKey, error: true };
        await sleep(1000);
      }
    }
  }

  return calendarData;
}

// ─── NETLIFY FUNCTION HANDLER ─────────────────────────────────────────────────

exports.handler = async (event, context) => {
  // Only allow POST with secret token for security
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const body = JSON.parse(event.body || "{}");
  if (body.secret !== process.env.GENERATION_SECRET) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const targetYear = body.year || new Date().getFullYear() + 1;
    const data = await generateYearData(targetYear);

    // Save to public directory so the React app can fetch it
    const outputPath = path.join(__dirname, "../../public", `transits-${targetYear}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        year: targetYear,
        message: `Generated transit data for ${targetYear}`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
