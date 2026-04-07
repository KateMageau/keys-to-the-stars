// netlify/functions/generate-transits.js
//
// Triggered once a year by the GitHub Action (or manually via POST).
// Calls the Astrologer RapidAPI for every day of the target year,
// calculates aspects, and pushes the resulting JSON file directly
// to the GitHub repo so Netlify can serve it as a static asset.
//
// Required environment variables (set in Netlify site settings):
//   REACT_APP_RAPIDAPI_KEY  — your RapidAPI key
//   GENERATION_SECRET       — shared secret to authorize this endpoint
//   GITHUB_TOKEN            — GitHub personal access token (repo scope)
//   GITHUB_REPO             — e.g. "yourusername/keys-to-the-stars"

const https = require("https");

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const RAPIDAPI_KEY  = process.env.REACT_APP_RAPIDAPI_KEY;
const RAPIDAPI_HOST = "astrologer.p.rapidapi.com";
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
const GITHUB_REPO   = process.env.GITHUB_REPO; // "username/repo-name"

const PLANETS = ["sun","moon","mercury","venus","mars","jupiter","saturn","uranus","neptune","pluto"];

const ASPECTS = [
  { name: "conjunction", symbol: "☌", degrees: 0,   orb: 8 },
  { name: "sextile",     symbol: "⚹", degrees: 60,  orb: 6 },
  { name: "square",      symbol: "□", degrees: 90,  orb: 8 },
  { name: "trine",       symbol: "△", degrees: 120, orb: 8 },
  { name: "opposition",  symbol: "☍", degrees: 180, orb: 8 },
];

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

const OUTER_PLANETS = ["jupiter","saturn","uranus","neptune","pluto"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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
  const keys = Object.keys(planets);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1 = keys[i], p2 = keys[j];
      const pos1 = planets[p1].position;
      const pos2 = planets[p2].position;
      if (pos1 === null || pos2 === null) continue;
      const diff = angleDiff(pos1, pos2);
      for (const aspect of ASPECTS) {
        const orb = Math.abs(diff - aspect.degrees);
        const maxOrb = (OUTER_PLANETS.includes(p1) && OUTER_PLANETS.includes(p2)) ? 3 : aspect.orb;
        if (orb <= maxOrb) {
          aspects.push({
            planet1: p1, planet2: p2,
            aspect: aspect.name, symbol: aspect.symbol,
            orb: Math.round(orb * 10) / 10,
            sign1: planets[p1].sign, sign2: planets[p2].sign,
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
  if (illumination < 52) return waxing ? "first_quarter"   : "last_quarter";
  if (illumination < 98) return waxing ? "waxing_gibbous"  : "waning_gibbous";
  return "full";
}

function isKeyMoonPhase(phase) {
  return ["new","first_quarter","full","last_quarter"].includes(phase);
}

// ─── HTTP HELPERS ─────────────────────────────────────────────────────────────

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const req = https.request({ ...options, headers: { ...options.headers, "Content-Length": Buffer.byteLength(data) } }, (res) => {
      let buf = "";
      res.on("data", chunk => buf += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(buf) }); }
        catch (e) { reject(new Error(`JSON parse error (${res.statusCode}): ${buf.slice(0, 300)}`)); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function apiPost(endpoint, body) {
  return httpsRequest({
    hostname: RAPIDAPI_HOST,
    path: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": RAPIDAPI_HOST,
    },
  }, body).then(r => r.body);
}

// ─── ASTROLOGY API CALLS ──────────────────────────────────────────────────────

async function getPlanetPositions(year, month, day) {
  const result = await apiPost("/api/v5/now/subject", {
    year, month, day,
    hour: 12, minute: 0,
    longitude: -122.4194,
    latitude: 37.7749,
    timezone: "America/Los_Angeles",
  });
  const planets = {};
  const raw = result.subject?.planets || result.planets || [];
  for (const planet of raw) {
    const name = planet.name?.toLowerCase();
    if (PLANETS.includes(name)) {
      planets[name] = {
        position:  planet.position ?? planet.abs_pos ?? null,
        sign:      planet.sign?.toLowerCase() ?? planet.sign_name?.toLowerCase() ?? null,
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
    phase:        result.phase        ?? result.moon_phase         ?? null,
    sign:         result.sign?.toLowerCase()  ?? result.moon_sign?.toLowerCase()  ?? null,
    waxing:       result.waxing ?? result.phase_name?.toLowerCase()?.includes("waxing") ?? null,
  };
}

// ─── GITHUB FILE PUSH ─────────────────────────────────────────────────────────

async function pushFileToGitHub(filename, content) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPO environment variables are required.");
  }

  const path = `public/${filename}`;
  const encoded = Buffer.from(content).toString("base64");

  // Check if file already exists (need its SHA to update it)
  let sha = null;
  try {
    const check = await httpsRequest({
      hostname: "api.github.com",
      path: `/repos/${GITHUB_REPO}/contents/${path}`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "keys-to-the-stars",
        "Accept": "application/vnd.github+json",
      },
    }, "{}");
    if (check.status === 200) sha = check.body.sha;
  } catch (_) {
    // File doesn't exist yet — that's fine, we'll create it
  }

  const payload = {
    message: `Auto-generate transit data: ${filename}`,
    content: encoded,
    ...(sha ? { sha } : {}),
  };

  const result = await httpsRequest({
    hostname: "api.github.com",
    path: `/repos/${GITHUB_REPO}/contents/${path}`,
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "keys-to-the-stars",
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
    },
  }, payload);

  if (result.status !== 200 && result.status !== 201) {
    throw new Error(`GitHub API error ${result.status}: ${JSON.stringify(result.body)}`);
  }

  return result.body;
}

// ─── MAIN GENERATION ──────────────────────────────────────────────────────────

async function generateYearData(year) {
  console.log(`Generating transit data for ${year}...`);
  const calendarData = {};
  let previousMoonSign = null;

  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
    calendarData[monthKey] = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      console.log(`Processing ${dateKey}...`);

      try {
        const [planets, moonData] = await Promise.all([
          getPlanetPositions(year, month, day),
          getMoonPhaseData(year, month, day),
        ]);

        const aspects = checkAspects(planets);

        const phaseKey = moonData.phase
          ? moonData.phase.toLowerCase().replace(" ", "_")
          : getMoonPhase(moonData.illumination || 0, moonData.waxing ?? true);

        const moonSign = planets.moon?.sign || moonData.sign;
        const moonIngress = moonSign && moonSign !== previousMoonSign ? moonSign : null;
        if (moonSign) previousMoonSign = moonSign;

        const retrogrades = PLANETS
          .filter(p => planets[p]?.retrograde)
          .map(p => ({ planet: p, symbol: PLANET_SYMBOLS[p] }));

        calendarData[monthKey][day] = {
          date: dateKey,
          moon: {
            sign:        moonSign,
            sign_symbol: moonSign ? SIGN_SYMBOLS[moonSign] : null,
            phase:       phaseKey,
            illumination: moonData.illumination,
            is_key_phase: isKeyMoonPhase(phaseKey),
            ingress:     moonIngress,
          },
          planets: Object.fromEntries(
            PLANETS.map(p => [p, {
              sign:       planets[p]?.sign || null,
              sign_symbol: planets[p]?.sign ? SIGN_SYMBOLS[planets[p].sign] : null,
              retrograde: planets[p]?.retrograde || false,
            }])
          ),
          aspects: aspects.map(a => ({
            planet1: a.planet1, planet2: a.planet2,
            planet1_symbol: PLANET_SYMBOLS[a.planet1],
            planet2_symbol: PLANET_SYMBOLS[a.planet2],
            aspect: a.aspect, aspect_symbol: a.symbol,
            sign1: a.sign1, sign2: a.sign2,
            sign1_symbol: a.sign1 ? SIGN_SYMBOLS[a.sign1] : null,
            sign2_symbol: a.sign2 ? SIGN_SYMBOLS[a.sign2] : null,
            label: `${PLANET_SYMBOLS[a.planet1]} ${a.planet1.charAt(0).toUpperCase() + a.planet1.slice(1)} ${a.symbol} ${PLANET_SYMBOLS[a.planet2]} ${a.planet2.charAt(0).toUpperCase() + a.planet2.slice(1)}`,
          })),
          retrogrades,
        };

        // Be polite to the API — 350ms between calls
        await sleep(350);

      } catch (err) {
        console.error(`Error on ${dateKey}:`, err.message);
        calendarData[monthKey][day] = { date: dateKey, error: true };
        await sleep(1500); // longer pause after an error
      }
    }
  }

  return calendarData;
}

// ─── NETLIFY FUNCTION HANDLER ─────────────────────────────────────────────────

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, body: "Invalid JSON" }; }

  if (body.secret !== process.env.GENERATION_SECRET) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  // Netlify functions time out at 26 seconds by default.
  // We respond immediately and do the work asynchronously.
  // The GitHub Action polls for the file rather than waiting on this response.
  const targetYear = body.year || new Date().getFullYear() + 1;

  // Kick off generation without awaiting — function returns 202 immediately
  setImmediate(async () => {
    try {
      const data = await generateYearData(targetYear);
      const filename = `transits-${targetYear}.json`;
      const json = JSON.stringify(data, null, 2);
      await pushFileToGitHub(filename, json);
      console.log(`Successfully pushed ${filename} to GitHub.`);
    } catch (err) {
      console.error("Generation failed:", err.message);
    }
  });

  return {
    statusCode: 202,
    body: JSON.stringify({
      accepted: true,
      year: targetYear,
      message: `Generating transit data for ${targetYear}. File will appear at public/transits-${targetYear}.json in your GitHub repo in approximately 6-8 hours.`,
    }),
  };
};
