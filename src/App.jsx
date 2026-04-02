import { useState, useCallback, useEffect } from "react";

const PLANETS = {
  sun:     { symbol: "☉", name: "Sun",     meaning: "The Sun represents identity, vitality, and conscious will. It is the core self — the part of you that seeks to express, create, and be recognized. It governs ego, purpose, and life force." },
  moon:    { symbol: "☽", name: "Moon",    meaning: "The Moon represents emotion, instinct, and the subconscious. It governs how we process feeling, what we need to feel safe, and the patterns beneath conscious awareness. It rules memory, home, and the body's rhythms." },
  mercury: { symbol: "☿", name: "Mercury", meaning: "Mercury represents mind, communication, and perception. It governs how we think, speak, write, and make connections. It rules learning, short travel, and the exchange of information." },
  venus:   { symbol: "♀", name: "Venus",   meaning: "Venus represents love, beauty, and value. It governs attraction, pleasure, aesthetics, and how we relate to others. It rules what we find worthwhile — in relationships, in art, and in material life." },
  mars:    { symbol: "♂", name: "Mars",    meaning: "Mars represents drive, action, and desire. It governs how we pursue what we want, how we assert ourselves, and how we handle anger and physical energy. It rules ambition, sexuality, and initiative." },
  jupiter: { symbol: "♃", name: "Jupiter", meaning: "Jupiter represents expansion, wisdom, and abundance. It governs where we grow, what we believe, and where life opens up with opportunity. It rules philosophy, higher learning, and optimism." },
  saturn:  { symbol: "♄", name: "Saturn",  meaning: "Saturn represents structure, responsibility, and mastery. It governs discipline, limitation, and the slow building of lasting things. It rules time, karma, authority, and hard-earned reward." },
  uranus:  { symbol: "♅", name: "Uranus",  meaning: "Uranus represents revolution, disruption, and awakening. It governs sudden change, innovation, and freedom from outdated structures. It rules technology, rebellion, and collective upheaval." },
  neptune: { symbol: "♆", name: "Neptune", meaning: "Neptune represents dreams, illusion, and transcendence. It governs spirituality, creativity, and the dissolution of boundaries. It rules what we idealize, what we cannot see clearly, and the longing for the infinite." },
  pluto:   { symbol: "♇", name: "Pluto",   meaning: "Pluto represents transformation, power, and depth. It governs irreversible change, the shadow self, and collective evolution. It rules what must die for something new to be born." },
};

const SIGNS = {
  aries:       { symbol: "♈", name: "Aries",       element: "Fire",  modality: "Cardinal", meaning: "Aries is the sign of initiation and identity. It is direct, bold, and self-starting. Aries energy moves quickly toward what it wants without hesitation, and burns brightest at the beginning of things." },
  taurus:      { symbol: "♉", name: "Taurus",      element: "Earth", modality: "Fixed",    meaning: "Taurus is the sign of stability and pleasure. It is patient, sensual, and deeply attached to what it values. Taurus energy builds slowly and endures — it seeks comfort, beauty, and security." },
  gemini:      { symbol: "♊", name: "Gemini",      element: "Air",   modality: "Mutable",  meaning: "Gemini is the sign of connection and curiosity. It is quick, dual, and information-hungry. Gemini energy gathers, communicates, and adapts — it is most alive when exchanging ideas." },
  cancer:      { symbol: "♋", name: "Cancer",      element: "Water", modality: "Cardinal", meaning: "Cancer is the sign of nurturing and memory. It is intuitive, protective, and deeply feeling. Cancer energy moves sideways toward what it loves and holds on tight to what matters." },
  leo:         { symbol: "♌", name: "Leo",          element: "Fire",  modality: "Fixed",    meaning: "Leo is the sign of creativity and recognition. It is warm, magnetic, and generous. Leo energy needs to express, to create, and to be seen — it leads from the heart." },
  virgo:       { symbol: "♍", name: "Virgo",        element: "Earth", modality: "Mutable",  meaning: "Virgo is the sign of refinement and service. It is analytical, precise, and devoted to improvement. Virgo energy notices what is wrong so it can make things better — it finds meaning in craft and usefulness." },
  libra:       { symbol: "♎", name: "Libra",        element: "Air",   modality: "Cardinal", meaning: "Libra is the sign of balance and relationship. It is diplomatic, aesthetic, and oriented toward fairness. Libra energy weighs, considers, and seeks harmony — often at the cost of its own decisive action." },
  scorpio:     { symbol: "♏", name: "Scorpio",      element: "Water", modality: "Fixed",    meaning: "Scorpio is the sign of depth and transformation. It is intense, perceptive, and unafraid of what is hidden. Scorpio energy seeks truth beneath the surface and is capable of profound regeneration." },
  sagittarius: { symbol: "♐", name: "Sagittarius",  element: "Fire",  modality: "Mutable",  meaning: "Sagittarius is the sign of expansion and seeking. It is philosophical, restless, and freedom-loving. Sagittarius energy chases meaning, adventure, and the broadest possible understanding of the world." },
  capricorn:   { symbol: "♑", name: "Capricorn",    element: "Earth", modality: "Cardinal", meaning: "Capricorn is the sign of ambition and authority. It is disciplined, patient, and oriented toward long-term achievement. Capricorn energy climbs steadily and builds things meant to last." },
  aquarius:    { symbol: "♒", name: "Aquarius",     element: "Air",   modality: "Fixed",    meaning: "Aquarius is the sign of innovation and collective vision. It is idealistic, unconventional, and oriented toward the future. Aquarius energy disrupts what is outdated in service of what could be." },
  pisces:      { symbol: "♓", name: "Pisces",       element: "Water", modality: "Mutable",  meaning: "Pisces is the sign of dreams and dissolution. It is fluid, empathic, and boundless. Pisces energy merges with what surrounds it, feeling everything — most alive at the edge of the tangible world." },
};

const ASPECTS = {
  conjunction: { symbol: "☌", name: "Conjunction", degrees: "0°",   meaning: "A conjunction occurs when two planets occupy the same degree of the zodiac. Their energies fully merge and intensify each other. The nature of the conjunction depends entirely on which planets are involved — the blending is total." },
  sextile:     { symbol: "⚹", name: "Sextile",     degrees: "60°",  meaning: "A sextile is a 60° angle between two planets. It is an opportunity aspect — the planets cooperate naturally and support each other's expression. Action is still required; the sextile opens a door but does not walk through it." },
  square:      { symbol: "□", name: "Square",       degrees: "90°",  meaning: "A square is a 90° angle between two planets. It creates friction and tension — the planets work at cross-purposes and demand resolution. Squares are uncomfortable but generative; they create the pressure that produces growth." },
  trine:       { symbol: "△", name: "Trine",        degrees: "120°", meaning: "A trine is a 120° angle between two planets. It is the most harmonious aspect — the planets flow easily together, amplifying each other without resistance. Trines represent natural ease and gifts that may go unnoticed precisely because they cost nothing." },
  opposition:  { symbol: "☍", name: "Opposition",  degrees: "180°", meaning: "An opposition is a 180° angle — two planets directly across the zodiac from each other. Their energies create polarity and awareness through contrast. Oppositions are often experienced through relationships, as we project one side outward." },
};

const HOUSES = {
  1:  { name: "1st House", ruling_sign: "Aries",       meaning: "The house of self, appearance, and beginnings. It represents how you present yourself to the world, your physical body, and the lens through which you approach new experiences." },
  2:  { name: "2nd House", ruling_sign: "Taurus",      meaning: "The house of resources, values, and self-worth. It governs money, possessions, and what you consider valuable — including how you value yourself." },
  3:  { name: "3rd House", ruling_sign: "Gemini",      meaning: "The house of communication, learning, and local movement. It governs the mind, siblings, short travel, and everyday exchange of information." },
  4:  { name: "4th House", ruling_sign: "Cancer",      meaning: "The house of home, roots, and private life. It represents family, ancestry, the domestic sphere, and the foundation beneath everything else." },
  5:  { name: "5th House", ruling_sign: "Leo",          meaning: "The house of creativity, pleasure, and self-expression. It governs art, play, romance, children, and anything that brings joy and allows the self to shine." },
  6:  { name: "6th House", ruling_sign: "Virgo",        meaning: "The house of health, work, and daily routine. It governs the body, service, habits, and the practical structures that sustain everyday life." },
  7:  { name: "7th House", ruling_sign: "Libra",        meaning: "The house of partnership and relationship. It governs marriage, significant partnerships, contracts, and the mirror that others hold up to us." },
  8:  { name: "8th House", ruling_sign: "Scorpio",      meaning: "The house of transformation, shared resources, and depth. It governs intimacy, death and rebirth, other people's money, and what is hidden beneath the surface." },
  9:  { name: "9th House", ruling_sign: "Sagittarius",  meaning: "The house of expansion, philosophy, and long journeys. It governs higher education, belief systems, foreign travel, and the search for meaning." },
  10: { name: "10th House", ruling_sign: "Capricorn",   meaning: "The house of career, public life, and legacy. It represents how you are seen in the world professionally and what you are building over the long term." },
  11: { name: "11th House", ruling_sign: "Aquarius",    meaning: "The house of community, friendship, and collective vision. It governs groups, social networks, ideals, and hopes for the future." },
  12: { name: "12th House", ruling_sign: "Pisces",      meaning: "The house of the hidden, the unconscious, and surrender. It governs what is behind the scenes — solitude, retreat, secret matters, and the dissolution of the ego." },
};

const MOON_PHASES = {
  new:             { emoji:"🌑", name:"New Moon",        meaning:"The New Moon occurs when the Sun and Moon occupy the same degree of the zodiac. The Moon is invisible from Earth — she is turned fully toward the Sun, not toward us. This is the beginning of the lunar cycle, a moment of pure potential before anything has taken form.", energy:"Beginnings, intentions, planting seeds, rest, withdrawal, inner quiet. The New Moon is not a time of outward action but of inward orientation.", good_for:"Setting intentions, starting new projects, journaling, visioning, rest, releasing what came before.", avoid:"Launching publicly, making final decisions, expecting high energy. The New Moon favors the private over the visible." },
  waxing_crescent: { emoji:"🌒", name:"Waxing Crescent", meaning:"The Waxing Crescent appears as the first sliver of light after the New Moon. The cycle is beginning to build — there is momentum gathering, though it is still fragile and new.", energy:"Initiation, early effort, building momentum, faith in what has been set in motion.", good_for:"Taking first steps, making plans concrete, reaching out, beginning what you envisioned at the New Moon.", avoid:"Giving up because results aren't visible yet. This phase requires trust in process." },
  first_quarter:   { emoji:"🌓", name:"First Quarter",   meaning:"The First Quarter Moon marks the halfway point between New and Full — the cycle is in full momentum and the first real challenges or decision points arrive.", energy:"Decision, effort, overcoming obstacles, commitment under pressure.", good_for:"Problem-solving, making decisions, pushing through resistance, taking decisive action.", avoid:"Backing away from difficulty. The friction of this phase is generative — it is asking for engagement, not retreat." },
  waxing_gibbous:  { emoji:"🌔", name:"Waxing Gibbous",  meaning:"The Waxing Gibbous Moon is almost full — the light is dominant but not yet complete. This is the phase of refinement and anticipation.", energy:"Refinement, analysis, preparation, fine-tuning.", good_for:"Editing, refining, reviewing, adjusting, preparing to share or release something.", avoid:"Starting entirely new endeavors. This phase is for bringing existing things to their best form." },
  full:            { emoji:"🌕", name:"Full Moon",        meaning:"The Full Moon occurs when the Sun and Moon are exactly opposite each other. The Moon is fully illuminated. Whatever was seeded at the New Moon has now reached culmination.", energy:"Culmination, revelation, heightened emotion, completion, peak energy.", good_for:"Celebrating completions, releasing what is finished, rituals, heightened creative work, important conversations.", avoid:"Starting new things from scratch. The Full Moon is for completion, not initiation." },
  waning_gibbous:  { emoji:"🌖", name:"Waning Gibbous",  meaning:"The Waning Gibbous follows the Full Moon as the light begins to decrease. Also called the Disseminating Moon, this phase is associated with sharing and distributing what was gained.", energy:"Sharing, teaching, communicating, gratitude, distributing wisdom.", good_for:"Teaching, writing, publishing, sharing, expressing gratitude, community engagement.", avoid:"Hoarding insights or keeping things private that want to be shared." },
  last_quarter:    { emoji:"🌗", name:"Last Quarter",    meaning:"The Last Quarter Moon is a moment of reorientation and letting go of what no longer serves the next cycle.", energy:"Release, reorientation, forgiveness, clearing, honest reflection.", good_for:"Decluttering, ending what has run its course, forgiveness work, honest self-assessment.", avoid:"Forcing new beginnings or clinging to what is clearly complete." },
  waning_crescent: { emoji:"🌘", name:"Waning Crescent", meaning:"The Waning Crescent is the final phase before the New Moon returns. Also called the Balsamic Moon — the most interior and quiet phase of the cycle.", energy:"Rest, surrender, solitude, dreaming, healing, completion.", good_for:"Rest, sleep, solitude, meditation, healing, letting go completely.", avoid:"Overextending, social demands, launching anything that needs momentum." },
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const STARS = Array.from({length:90},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,r:Math.random()*1.5+0.3,o:Math.random()*0.45+0.08,d:Math.random()*4+2}));
function getMonthKey(y,m){return `${y}-${String(m).padStart(2,"0")}`;}
function getDaysInMonth(y,m){return new Date(y,m,0).getDate();}
function getStartDow(y,m){return new Date(y,m-1,1).getDay();}
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):"";const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --lav:#c5b8d8;--lav-mid:#b0a0cc;--lav-deep:#9d8fc0;
  --dusk:#2a1f3d;--dusk-mid:#1e1530;--ink:#1a1428;
  --bg:#f0ecf7;--bg-mid:#e4ddf0;--bg-light:#f7f4fb;
  --text:#1a1428;--text-mid:#3d3054;--text-light:#6b5c80;
  --gold:#c9a84c;--gold-lt:#e8cc7a;--moon:#7ab8c4;--void:#c4957a;
}
body{font-family:'Lato',sans-serif;font-weight:300;background:var(--dusk-mid);color:var(--text);min-height:100vh;}
.shell{position:relative;min-height:100vh;padding:16px;}
.nebula{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse 55% 40% at 8% 18%,rgba(120,60,180,0.38) 0%,transparent 70%),
    radial-gradient(ellipse 45% 55% at 92% 12%,rgba(60,80,200,0.28) 0%,transparent 70%),
    radial-gradient(ellipse 65% 50% at 82% 88%,rgba(160,60,140,0.32) 0%,transparent 70%),
    radial-gradient(ellipse 38% 42% at 18% 82%,rgba(80,40,160,0.32) 0%,transparent 70%),
    radial-gradient(ellipse 75% 75% at 50% 50%,rgba(30,21,48,0.96) 22%,transparent 100%);}
.stars-layer{position:fixed;inset:0;pointer-events:none;z-index:0;}
.card{position:relative;z-index:1;background:var(--bg);border-radius:16px;
  border:1px solid rgba(197,184,216,0.3);
  box-shadow:0 0 0 1px rgba(197,184,216,0.12),0 8px 40px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.8);
  overflow:hidden;max-width:1100px;margin:0 auto;}
.hdr{background:linear-gradient(135deg,var(--dusk) 0%,#1a1040 100%);
  padding:1.75rem 2.5rem 1.4rem;border-bottom:2px solid rgba(197,184,216,0.18);
  display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;}
.logo{font-family:'Playfair Display',serif;font-size:2rem;font-weight:400;color:var(--lav);letter-spacing:0.05em;}
.logo em{color:var(--gold-lt);font-style:italic;}
.logo-sub{font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(197,184,216,0.45);margin-top:0.25rem;}
.hdr-right{text-align:right;color:rgba(197,184,216,0.55);font-size:0.78rem;letter-spacing:0.04em;line-height:1.9;}
.print-btn{background:none;border:1px solid rgba(197,184,216,0.3);border-radius:5px;
  padding:0.3rem 0.8rem;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;
  color:rgba(197,184,216,0.55);cursor:pointer;transition:all 0.15s;margin-top:0.3rem;}
.print-btn:hover{background:rgba(197,184,216,0.12);color:var(--lav);}
.moon-bar{background:var(--dusk);padding:0.65rem 2.5rem;display:flex;gap:2rem;flex-wrap:wrap;
  font-size:0.68rem;letter-spacing:0.07em;color:rgba(197,184,216,0.45);border-bottom:1px solid rgba(197,184,216,0.1);}
.moon-bar span{color:var(--lav);margin-left:0.35rem;}
.moon-bar-item{cursor:pointer;border-radius:5px;padding:0.2rem 0.4rem;margin:-0.2rem -0.4rem;transition:background 0.15s;}
.moon-bar-item:hover{background:rgba(197,184,216,0.1);}
.moon-bar-item.active{background:rgba(197,184,216,0.15);}
.loading-bar{background:var(--dusk);padding:0.65rem 2.5rem;font-size:0.7rem;
  color:rgba(197,184,216,0.5);letter-spacing:0.08em;font-style:italic;text-align:center;}
.sec{padding:1.75rem 2.5rem;border-bottom:1px solid var(--bg-mid);}
.sec:last-child{border-bottom:none;}
.sec-hdr{display:flex;align-items:baseline;gap:0.85rem;margin-bottom:1.25rem;flex-wrap:wrap;}
.sec-title{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:500;color:var(--text-mid);}
.sec-meta{font-size:0.67rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-light);}
.see-more{background:none;border:1px solid var(--lav-mid);border-radius:5px;
  padding:0.3rem 0.9rem;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--lav-deep);cursor:pointer;transition:all 0.15s;margin-left:auto;}
.see-more:hover{background:var(--lav-deep);color:white;}
.t-row{border:1px solid var(--bg-mid);border-radius:9px;margin-bottom:0.55rem;overflow:hidden;transition:box-shadow 0.2s;}
.t-row:hover{box-shadow:0 2px 14px rgba(120,60,180,0.1);}
.t-main{display:grid;grid-template-columns:1fr auto;align-items:center;gap:1rem;
  padding:0.9rem 1.2rem;cursor:pointer;background:white;}
.t-phrase{display:flex;flex-wrap:wrap;align-items:center;gap:0.3rem;
  font-family:'Playfair Display',serif;font-size:1rem;color:var(--text);}
.tw{cursor:pointer;border-bottom:1px dotted var(--lav-deep);padding-bottom:1px;transition:color 0.15s,border-color 0.15s;}
.tw:hover,.tw.on{color:var(--ink);border-bottom-color:var(--ink);font-weight:500;}
.tw-p{color:var(--text-mid);}
.tw-a{color:var(--text-light);font-size:0.88rem;font-family:'Lato',sans-serif;}
.in-word{color:var(--lav-deep);font-size:0.82rem;font-family:'Lato',sans-serif;}
.t-right{display:flex;flex-direction:column;align-items:flex-end;gap:0.2rem;}
.retro-badge{font-size:0.58rem;color:var(--void);background:#faeee6;padding:0.1rem 0.4rem;border-radius:10px;}
.defs-panel{background:var(--bg-mid);border-top:1px solid rgba(157,143,192,0.2);padding:1.1rem 1.4rem;}
.defs-top{display:flex;justify-content:flex-end;margin-bottom:0.75rem;}
.collapse-btn{background:none;border:1px solid rgba(157,143,192,0.4);border-radius:5px;
  padding:0.2rem 0.7rem;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--text-light);cursor:pointer;transition:all 0.15s;}
.collapse-btn:hover{background:var(--lav-deep);color:white;border-color:var(--lav-deep);}
.defs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:0.85rem;}
.def-lbl{font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--lav-deep);margin-bottom:0.28rem;}
.def-ttl{font-family:'Playfair Display',serif;font-size:0.95rem;color:var(--text);margin-bottom:0.3rem;}
.def-body{font-size:0.8rem;line-height:1.7;color:var(--text-mid);}
.cal-nav{display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem;}
.cal-nav-title{font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--text-mid);flex:1;text-align:center;}
.cal-nav-btn{background:none;border:1px solid var(--bg-mid);border-radius:5px;
  padding:0.3rem 0.75rem;font-size:0.75rem;color:var(--text-light);cursor:pointer;transition:all 0.15s;}
.cal-nav-btn:hover{background:var(--dusk);color:var(--lav);border-color:var(--dusk);}
.cal-nav-btn:disabled{opacity:0.3;cursor:default;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--bg-mid);
  border:1px solid var(--bg-mid);border-radius:10px;overflow:hidden;}
.cal-dh{background:var(--dusk);color:rgba(197,184,216,0.65);font-size:0.62rem;
  letter-spacing:0.12em;text-transform:uppercase;text-align:center;padding:0.45rem;}
.cal-cell{background:white;min-height:90px;padding:0.35rem;cursor:pointer;transition:background 0.15s;}
.cal-cell.empty{background:#f8f5fc;cursor:default;min-height:60px;}
.cal-cell:not(.empty):hover{background:#f3eefb;}
.cal-cell.sel{background:#ece6f5;}
.cal-cell.today-cell{border-top:2px solid var(--lav-deep);}
.cal-cell.past{opacity:0.65;}
.cal-num{font-size:0.72rem;color:var(--text-light);margin-bottom:0.15rem;}
.today-cell .cal-num{color:var(--dusk);font-weight:700;}
.cal-phase-emoji{font-size:0.85rem;line-height:1;margin-bottom:0.1rem;}
.ev{font-size:0.55rem;line-height:1.25;border-radius:3px;padding:0.1rem 0.25rem;margin-bottom:0.08rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ev.transit{background:#ede8f7;color:var(--text-mid);}
.ev.ingress{background:#dff0f4;color:#3a6070;}
.ev.retrograde{background:#faeee6;color:#8c4e28;}
.cal-detail{background:white;border:1px solid var(--bg-mid);border-radius:9px;padding:1.1rem 1.4rem;margin-top:0.85rem;}
.cal-d-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;}
.cal-d-date{font-family:'Playfair Display',serif;font-size:1rem;color:var(--text-mid);}
.cal-d-moon{font-size:0.78rem;color:var(--text-light);font-style:italic;}
.cal-detail-grid{display:grid;grid-template-columns:1fr auto;gap:0 1.25rem;align-items:baseline;}
.cal-detail-grid .ev-row{display:contents;}
.cal-detail-grid .ev-row>*{padding:0.42rem 0;border-bottom:1px solid var(--bg-mid);font-size:0.82rem;}
.cal-detail-grid .ev-row:last-child>*{border-bottom:none;}
.ev-name{color:var(--text);font-family:'Playfair Display',serif;}
.ev-sign{color:var(--text-light);font-size:0.72rem;}
.ev-badge{font-size:0.58rem;padding:0.1rem 0.45rem;border-radius:10px;margin-left:0.35rem;}
.badge-transit{background:#ede8f7;color:var(--lav-deep);}
.badge-ingress{background:#dff0f4;color:#3a6070;}
.badge-retro{background:#faeee6;color:#8c4e28;}
.no-events{color:var(--text-light);font-style:italic;font-size:0.82rem;}
.moon-jump{display:flex;align-items:center;justify-content:center;padding:1rem 2.5rem;
  background:var(--bg-light);border-bottom:1px solid var(--bg-mid);}
.moon-jump a{font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--lav-deep);
  text-decoration:none;border:1px solid var(--lav-mid);border-radius:5px;padding:0.4rem 1.1rem;transition:all 0.15s;}
.moon-jump a:hover{background:var(--dusk);color:var(--lav);border-color:var(--dusk);}
.phase-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0.75rem;}
.phase-card{background:white;border:1px solid var(--bg-mid);border-radius:9px;padding:1rem 1.2rem;cursor:pointer;transition:all 0.2s;}
.phase-card:hover{box-shadow:0 2px 14px rgba(120,60,180,0.1);border-color:var(--lav-mid);}
.phase-card.open{border-color:var(--lav-deep);background:var(--bg-light);}
.phase-card-top{display:flex;align-items:center;gap:0.75rem;}
.phase-emoji{font-size:1.6rem;line-height:1;}
.phase-name{font-family:'Playfair Display',serif;font-size:1rem;color:var(--text);}
.phase-chevron{margin-left:auto;color:var(--lav-deep);font-size:0.75rem;transition:transform 0.2s;}
.phase-card.open .phase-chevron{transform:rotate(180deg);}
.phase-body{margin-top:0.85rem;border-top:1px solid var(--bg-mid);padding-top:0.85rem;}
.phase-meaning{font-size:0.82rem;line-height:1.75;color:var(--text-mid);margin-bottom:0.75rem;}
.phase-sub-label{font-size:0.58rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--lav-deep);margin-bottom:0.3rem;margin-top:0.65rem;}
.phase-sub-text{font-size:0.8rem;line-height:1.68;color:var(--text-mid);}
.birth-grid{display:grid;grid-template-columns:300px 1fr;gap:2rem;align-items:start;}
.b-lbl{font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-light);display:block;margin-bottom:0.3rem;}
.b-input{width:100%;border:1px solid var(--bg-mid);border-radius:6px;padding:0.55rem 0.8rem;
  font-family:'Lato',sans-serif;font-size:0.82rem;color:var(--text);background:white;
  outline:none;margin-bottom:0.75rem;transition:border-color 0.2s;}
.b-input:focus{border-color:var(--lav-deep);}
.b-input::placeholder{color:rgba(107,92,128,0.4);}
.b-btn{background:var(--dusk);color:var(--lav);border:none;border-radius:6px;
  padding:0.65rem 1.25rem;font-family:'Lato',sans-serif;font-size:0.7rem;
  letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;width:100%;transition:background 0.2s;}
.b-btn:hover{background:var(--ink);}
.b-btn:disabled{opacity:0.6;cursor:not-allowed;}
.house-card{background:white;border:1px solid var(--bg-mid);border-radius:8px;padding:0.85rem 1.05rem;margin-bottom:0.6rem;}
.hc-top{font-size:0.6rem;letter-spacing:0.13em;text-transform:uppercase;color:var(--lav-deep);margin-bottom:0.25rem;}
.hc-name{font-family:'Playfair Display',serif;font-size:0.98rem;color:var(--text);margin-bottom:0.3rem;}
.hc-body{font-size:0.8rem;line-height:1.68;color:var(--text-mid);}
.placeholder-note{font-style:italic;font-size:0.82rem;color:var(--text-light);line-height:1.7;border-left:3px solid var(--lav);padding-left:0.85rem;}
.house-intro{font-size:0.82rem;color:var(--text-light);margin-bottom:1rem;font-style:italic;line-height:1.6;}
.chart-error{margin-top:0.75rem;font-size:0.78rem;color:#c0392b;line-height:1.6;}
.no-data-msg{background:var(--bg-light);border:1px solid var(--bg-mid);border-radius:8px;
  padding:1.5rem;text-align:center;color:var(--text-light);font-style:italic;font-size:0.85rem;line-height:1.7;}
.week-date-lbl{font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-light);padding-left:0.1rem;margin-bottom:0.25rem;margin-top:0.6rem;}
@media(max-width:700px){.birth-grid{grid-template-columns:1fr;}.hdr,.sec,.moon-bar{padding-left:1.5rem;padding-right:1.5rem;}}
@media print{
  .nebula,.stars-layer,.no-print{display:none !important;}
  .shell{padding:0;background:white;}
  .card{box-shadow:none;border:none;border-radius:0;}
  .hdr{background:none;border-bottom:2px solid #333;}
  .logo,.logo em{color:#1a1428 !important;}
  .moon-bar{background:none;border:1px solid #ccc;color:#555;}
  .moon-bar span{color:#333;}
  .sec{padding:1rem;}
  .cal-dh{background:#333;}
  .birth-grid,.defs-panel,.see-more,.print-btn,.moon-jump{display:none !important;}
}
`;function PhaseCard({ phaseKey }) {
  const [open, setOpen] = useState(false);
  const phase = MOON_PHASES[phaseKey];
  if (!phase) return null;
  return (
    <div className={`phase-card ${open?"open":""}`} onClick={()=>setOpen(v=>!v)}>
      <div className="phase-card-top">
        <span className="phase-emoji">{phase.emoji}</span>
        <span className="phase-name">{phase.name}</span>
        <span className="phase-chevron">▼</span>
      </div>
      {open && (
        <div className="phase-body">
          <p className="phase-meaning">{phase.meaning}</p>
          <div className="phase-sub-label">Energy</div>
          <p className="phase-sub-text">{phase.energy}</p>
          <div className="phase-sub-label">Good for</div>
          <p className="phase-sub-text">{phase.good_for}</p>
          <div className="phase-sub-label">Move gently around</div>
          <p className="phase-sub-text">{phase.avoid}</p>
        </div>
      )}
    </div>
  );
}

function TransitRow({ aspect }) {
  const [words, setWords] = useState(new Set());
  const [open, setOpen] = useState(false);
  const p1 = PLANETS[aspect.planet1];
  const p2 = PLANETS[aspect.planet2];
  const asp = ASPECTS[aspect.aspect];
  const s1 = SIGNS[aspect.sign1];
  const s2 = SIGNS[aspect.sign2];
  const tap = (e,w) => {
    e.stopPropagation();
    setWords(prev => { const n=new Set(prev); n.has(w)?n.delete(w):n.add(w); return n; });
    setOpen(true);
  };
  if (!p1||!p2||!asp) return null;
  const defs = [];
  if (words.has("p1")) defs.push({key:"p1",lbl:"Planet",ttl:`${p1.symbol} ${p1.name}`,body:p1.meaning});
  if (words.has("s1")&&s1) defs.push({key:"s1",lbl:"Sign",ttl:`${s1.symbol} ${s1.name} · ${s1.element} · ${s1.modality}`,body:s1.meaning});
  if (words.has("asp")) defs.push({key:"asp",lbl:"Aspect",ttl:`${asp.symbol} ${asp.name} ${asp.degrees}`,body:asp.meaning});
  if (words.has("p2")) defs.push({key:"p2",lbl:"Planet",ttl:`${p2.symbol} ${p2.name}`,body:p2.meaning});
  if (words.has("s2")&&s2) defs.push({key:"s2",lbl:"Sign",ttl:`${s2.symbol} ${s2.name} · ${s2.element} · ${s2.modality}`,body:s2.meaning});
  return (
    <div className="t-row">
      <div className="t-main">
        <div className="t-phrase">
          <span className={`tw tw-p ${words.has("p1")?"on":""}`} onClick={e=>tap(e,"p1")}>{p1.symbol} {p1.name}</span>
          {s1&&<><span className="in-word">in</span><span className={`tw ${words.has("s1")?"on":""}`} onClick={e=>tap(e,"s1")}>{s1.symbol} {s1.name}</span></>}
          <span className={`tw tw-a ${words.has("asp")?"on":""}`} onClick={e=>tap(e,"asp")}>{asp.symbol} {asp.name}</span>
          <span className={`tw tw-p ${words.has("p2")?"on":""}`} onClick={e=>tap(e,"p2")}>{p2.symbol} {p2.name}</span>
          {s2&&<><span className="in-word">in</span><span className={`tw ${words.has("s2")?"on":""}`} onClick={e=>tap(e,"s2")}>{s2.symbol} {s2.name}</span></>}
        </div>
        <div className="t-right">
          {aspect.retrograde&&<span className="retro-badge">℞</span>}
        </div>
      </div>
      {open&&defs.length>0&&(
        <div className="defs-panel">
          <div className="defs-top">
            <button className="collapse-btn" onClick={()=>{setOpen(false);setWords(new Set());}}>↑ Collapse</button>
          </div>
          <div className="defs-grid">
            {defs.map(d=>(
              <div key={d.key}>
                <div className="def-lbl">{d.lbl}</div>
                <div className="def-ttl">{d.ttl}</div>
                <div className="def-body">{d.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const now = new Date();
  const todayYear=now.getFullYear(), todayMonth=now.getMonth()+1, todayDay=now.getDate();

  const [transitData, setTransitData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [calYear, setCalYear] = useState(todayYear);
  const [calMonth, setCalMonth] = useState(todayMonth);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showWeek, setShowWeek] = useState(false);
  const [moonBarOpen, setMoonBarOpen] = useState(false);
  const [birthData, setBirthData] = useState({date:"",time:"",place:""});
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [showHouses, setShowHouses] = useState(false);

  useEffect(() => {
    async function load() {
      setDataLoading(true);
      for (const y of [todayYear, todayYear+1]) {
        try {
          const r = await fetch(`/transits-${y}.json`);
          if (r.ok) { setTransitData(await r.json()); setDataLoading(false); return; }
        } catch {}
      }
      setDataError("Transit data is being generated. Please check back shortly.");
      setDataLoading(false);
    }
    load();
  }, [todayYear]);

  function getDayData(y,m,d) {
    if (!transitData) return null;
    return transitData[getMonthKey(y,m)]?.[d] || null;
  }

  const todayData = getDayData(todayYear, todayMonth, todayDay);

  function getWeekData() {
    const days = [];
    for (let i=1; i<=7; i++) {
      const d = new Date(todayYear, todayMonth-1, todayDay+i);
      const data = getDayData(d.getFullYear(), d.getMonth()+1, d.getDate());
      if (data) days.push({date:d, data});
    }
    return days;
  }

  const minYear  = todayMonth===1 ? todayYear-1 : todayYear;
  const minMonth = todayMonth===1 ? 12 : todayMonth-1;
  function canGoPrev() { return calYear>minYear||(calYear===minYear&&calMonth>minMonth); }
  function canGoNext() { return new Date(calYear,calMonth-1+1,1)<=new Date(todayYear,todayMonth-1+12,1); }
  function prevMonth() { if(!canGoPrev())return; if(calMonth===1){setCalYear(y=>y-1);setCalMonth(12);}else setCalMonth(m=>m-1); setSelectedDay(null); }
  function nextMonth() { if(!canGoNext())return; if(calMonth===12){setCalYear(y=>y+1);setCalMonth(1);}else setCalMonth(m=>m+1); setSelectedDay(null); }

  const parseBirthDate = s => { const d=new Date(s); return isNaN(d)?null:{year:d.getFullYear(),month:d.getMonth()+1,day:d.getDate()}; };
  const parseBirthTime = s => {
    const m=s.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if(!m) return {hour:12,minute:0};
    let h=parseInt(m[1]); const min=parseInt(m[2]),ap=m[3]?.toUpperCase();
    if(ap==="PM"&&h!==12) h+=12;
    if(ap==="AM"&&h===12) h=0;
    return {hour:h,minute:min};
  };

  const fetchChart = useCallback(async () => {
    if (!birthData.date||!birthData.place) return;
    setChartLoading(true); setChartError(null); setChartData(null);
    const dp=parseBirthDate(birthData.date), tp=parseBirthTime(birthData.time||"12:00 PM");
    if (!dp) { setChartError("Please enter a valid date, e.g. June 3, 1990"); setChartLoading(false); return; }
    try {
      const r = await fetch("https://astrologer.p.rapidapi.com/api/v5/chart-data/birth-chart", {
        method: "POST",
        headers: {"Content-Type":"application/json","X-RapidAPI-Key":process.env.REACT_APP_RAPIDAPI_KEY,"X-RapidAPI-Host":"astrologer.p.rapidapi.com"},
        body: JSON.stringify({subject:{name:"User",year:dp.year,month:dp.month,day:dp.day,hour:tp.hour,minute:tp.minute,city:birthData.place,nation:"US",timezone:"America/Los_Angeles",house_system:"W"}}),
      });
      if (!r.ok) throw new Error(`API error ${r.status}`);
      setChartData(await r.json()); setShowHouses(true);
    } catch { setChartError("Couldn't load your chart. Please check your birth data and try again."); }
    finally { setChartLoading(false); }
  }, [birthData]);

  const getHouseFromSign = (sign,rising) => {
    const s=["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
    const ri=s.indexOf(rising?.toLowerCase()), si=s.indexOf(sign?.toLowerCase());
    if(ri===-1||si===-1) return null;
    return ((si-ri+12)%12)+1;
  };

  const daysInMonth=getDaysInMonth(calYear,calMonth), startDow=getStartDow(calYear,calMonth);
  const cells=[]; for(let i=0;i<startDow;i++) cells.push(null); for(let d=1;d<=daysInMonth;d++) cells.push(d);
  const isToday = d => calYear===todayYear&&calMonth===todayMonth&&d===todayDay;
  const isPast  = d => new Date(calYear,calMonth-1,d)<new Date(todayYear,todayMonth-1,todayDay);
  const selDayData = selectedDay ? getDayData(calYear,calMonth,selectedDay) : null;
  const todayDisplay = now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});return (
    <>
      <style>{css}</style>
      <div className="nebula"/>
      <svg className="stars-layer" xmlns="http://www.w3.org/2000/svg">
        {STARS.map(s=>(
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o}>
            <animate attributeName="opacity" values={`${s.o};${Math.min(s.o+0.35,0.85)};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      <div className="shell"><div className="card">

        <header className="hdr">
          <div>
            <div className="logo">Keys to the <em>Stars</em></div>
            <div className="logo-sub">Astrology literacy · Whole sign houses · PST</div>
          </div>
          <div className="hdr-right">
            <div>{todayDisplay}</div>
            <button className="print-btn no-print" onClick={()=>window.print()}>⎙ Print Calendar</button>
          </div>
        </header>

        {dataLoading ? (
          <div className="loading-bar">Loading sky data for {todayYear}... ✨</div>
        ) : todayData ? (
          <div className="moon-bar">
            <div className={`moon-bar-item ${moonBarOpen?"active":""}`} onClick={()=>setMoonBarOpen(v=>!v)}>
              Moon<span>{todayData.moon?.sign_symbol} {cap(todayData.moon?.sign)}</span>
            </div>
            <div className={`moon-bar-item ${moonBarOpen?"active":""}`} onClick={()=>setMoonBarOpen(v=>!v)}>
              Phase<span>{MOON_PHASES[todayData.moon?.phase]?.emoji} {MOON_PHASES[todayData.moon?.phase]?.name}{todayData.moon?.illumination?` ${Math.round(todayData.moon.illumination)}%`:""}</span>
            </div>
            {todayData.retrogrades?.length>0&&(
              <div>Retrograde<span>{todayData.retrogrades.map(r=>r.symbol).join(" ")}</span></div>
            )}
          </div>
        ) : (
          <div className="loading-bar">{dataError||"Sky data unavailable — transit file may still be generating."}</div>
        )}

        {moonBarOpen&&todayData?.moon?.phase&&(
          <div style={{background:"var(--dusk)",padding:"1rem 2.5rem",borderBottom:"1px solid rgba(197,184,216,0.1)"}}>
            <div style={{fontSize:"0.6rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(197,184,216,0.5)",marginBottom:"0.75rem"}}>Today's Moon Phase</div>
            <div style={{maxWidth:500}}><PhaseCard phaseKey={todayData.moon.phase}/></div>
            <button onClick={()=>setMoonBarOpen(false)} style={{background:"none",border:"none",color:"rgba(197,184,216,0.4)",fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",marginTop:"0.75rem"}}>↑ Close</button>
          </div>
        )}

        {/* TODAY */}
        <section className="sec">
          <div className="sec-hdr">
            <span className="sec-title">Today's Sky</span>
            <span className="sec-meta">Tap any word to learn it</span>
          </div>
          {!todayData&&!dataLoading&&(
            <div className="no-data-msg">Transit data is being generated. Run the generation script or check back shortly.</div>
          )}
          {todayData?.aspects?.length===0&&(
            <div className="no-data-msg">No major aspects today — a quieter day in the sky.</div>
          )}
          {todayData?.aspects?.map((a,i)=><TransitRow key={i} aspect={a}/>)}
          {todayData?.moon?.ingress&&(
            <div className="t-row" style={{background:"#dff0f4"}}>
              <div className="t-main" style={{background:"#dff0f4"}}>
                <div className="t-phrase" style={{fontFamily:"'Playfair Display',serif"}}>
                  ☽ Moon enters {todayData.moon.sign_symbol} {cap(todayData.moon.sign)}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* THIS WEEK */}
        <section className="sec">
          <div className="sec-hdr">
            <span className="sec-title">This Week</span>
            <span className="sec-meta">Next 7 days</span>
            <button className="see-more no-print" onClick={()=>setShowWeek(v=>!v)}>
              {showWeek?"Collapse ↑":"See more ↓"}
            </button>
          </div>
          {!showWeek&&(
            <div style={{color:"var(--text-light)",fontSize:"0.83rem",fontStyle:"italic"}}>
              Click "See more" to see upcoming transits.
            </div>
          )}
          {showWeek&&getWeekData().map(({date,data},i)=>(
            <div key={i}>
              <div className="week-date-lbl">
                {date.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                {data.moon?.is_key_phase&&(
                  <span style={{marginLeft:"0.5rem"}}>
                    {MOON_PHASES[data.moon.phase]?.emoji} {MOON_PHASES[data.moon.phase]?.name}
                  </span>
                )}
              </div>
              {data.aspects?.length===0&&(
                <div style={{fontSize:"0.78rem",color:"var(--text-light)",fontStyle:"italic",marginBottom:"0.5rem"}}>
                  No major aspects
                </div>
              )}
              {data.aspects?.map((a,j)=><TransitRow key={j} aspect={a}/>)}
              {data.moon?.ingress&&(
                <div className="t-row" style={{background:"#dff0f4"}}>
                  <div className="t-main" style={{background:"#dff0f4"}}>
                    <div className="t-phrase" style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem"}}>
                      ☽ Moon enters {data.moon.sign_symbol} {cap(data.moon.sign)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* CALENDAR */}
        <section className="sec">
          <div className="cal-nav">
            <button className="cal-nav-btn no-print" onClick={prevMonth} disabled={!canGoPrev()}>← Prev</button>
            <div className="cal-nav-title">{MONTH_NAMES[calMonth-1]} {calYear}</div>
            <button className="cal-nav-btn no-print" onClick={nextMonth} disabled={!canGoNext()}>Next →</button>
          </div>
          <div style={{fontSize:"0.68rem",color:"var(--text-light)",marginBottom:"0.85rem",display:"flex",gap:"1.2rem",flexWrap:"wrap"}}>
            <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#ede8f7",marginRight:5,verticalAlign:"middle"}}/>Aspect</span>
            <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#dff0f4",marginRight:5,verticalAlign:"middle"}}/>Moon ingress</span>
            <span>🌑🌓🌕🌗 Key phases only</span>
          </div>
          <div className="cal-grid">
            {DAY_NAMES.map(d=><div key={d} className="cal-dh">{d}</div>)}
            {cells.map((d,i)=>{
              const dd=d?getDayData(calYear,calMonth,d):null;
              return (
                <div key={i}
                  className={`cal-cell ${!d?"empty":""} ${d&&isToday(d)?"today-cell":""} ${d===selectedDay?"sel":""} ${d&&isPast(d)?"past":""}`}
                  onClick={()=>d&&setSelectedDay(d===selectedDay?null:d)}
                >
                  {d&&<>
                    <div className="cal-num">{d}</div>
                    {dd?.moon?.is_key_phase&&<div className="cal-phase-emoji">{MOON_PHASES[dd.moon.phase]?.emoji}</div>}
                    {dd?.moon?.ingress&&<div className="ev ingress">☽→{dd.moon.sign_symbol}{cap(dd.moon.sign).slice(0,3)}</div>}
                    {dd?.aspects?.slice(0,3).map((a,j)=>(
                      <div key={j} className="ev transit" title={a.label}>
                        {a.planet1_symbol}{a.aspect_symbol}{a.planet2_symbol}
                      </div>
                    ))}
                    {dd?.aspects?.length>3&&<div className="ev transit">+{dd.aspects.length-3}</div>}
                    {dd?.retrogrades?.length>0&&<div className="ev retrograde">℞{dd.retrogrades.map(r=>r.symbol).join("")}</div>}
                  </>}
                </div>
              );
            })}
          </div>

          {selectedDay&&(
            <div className="cal-detail">
              <div className="cal-d-header">
                <div className="cal-d-date">{MONTH_NAMES[calMonth-1]} {selectedDay}, {calYear}</div>
                {selDayData?.moon&&(
                  <div className="cal-d-moon">
                    {MOON_PHASES[selDayData.moon.phase]?.emoji} {MOON_PHASES[selDayData.moon.phase]?.name}
                    {selDayData.moon.illumination?` · ${Math.round(selDayData.moon.illumination)}%`:""}
                    {selDayData.moon.sign?` · Moon in ${selDayData.moon.sign_symbol} ${cap(selDayData.moon.sign)}`:""}
                  </div>
                )}
              </div>
              {!selDayData?(
                <div className="no-events">No data available for this date.</div>
              ):(
                <div className="cal-detail-grid">
                  {selDayData.moon?.ingress&&(
                    <div className="ev-row">
                      <span className="ev-name">
                        Moon enters {selDayData.moon.sign_symbol} {cap(selDayData.moon.sign)}
                        <span className="ev-badge badge-ingress">ingress</span>
                      </span>
                      <span className="ev-sign"></span>
                    </div>
                  )}
                  {selDayData.retrogrades?.map((r,i)=>(
                    <div key={i} className="ev-row">
                      <span className="ev-name">
                        {r.symbol} {cap(r.planet)} retrograde
                        <span className="ev-badge badge-retro">℞</span>
                      </span>
                      <span className="ev-sign"></span>
                    </div>
                  ))}
                  {selDayData.aspects?.length===0&&(
                    <div className="no-events" style={{gridColumn:"1/-1"}}>No major aspects on this day.</div>
                  )}
                  {selDayData.aspects?.map((a,i)=>(
                    <div key={i} className="ev-row">
                      <span className="ev-name">
                        {a.label}
                        <span className="ev-badge badge-transit">aspect</span>
                      </span>
                      <span className="ev-sign">{a.sign1_symbol}{a.sign1} / {a.sign2_symbol}{a.sign2}</span>
                    </div>
                  ))}
                </div>
              )}
              {selDayData?.moon?.is_key_phase&&(
                <div style={{marginTop:"0.85rem"}}>
                  <div style={{fontSize:"0.6rem",letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--lav-deep)",marginBottom:"0.5rem"}}>Moon Phase</div>
                  <PhaseCard phaseKey={selDayData.moon.phase}/>
                </div>
              )}
            </div>
          )}
        </section>{/* MOON PHASES JUMP */}
        <div className="moon-jump no-print">
          <a href="#moon-phases">🌑 Learn about the 8 Moon Phases ↓</a>
        </div>

        {/* MOON PHASES */}
        <section className="sec" id="moon-phases">
          <div className="sec-hdr">
            <span className="sec-title">Moon Phases</span>
            <span className="sec-meta">The 8 phases · click any to learn its meaning</span>
          </div>
          <div className="phase-grid">
            {Object.keys(MOON_PHASES).map(k=><PhaseCard key={k} phaseKey={k}/>)}
          </div>
        </section>

        {/* BIRTH CHART */}
        <section className="sec" id="your-chart">
          <div className="sec-hdr">
            <span className="sec-title">Your Chart</span>
            <span className="sec-meta">See which houses today's transits activate for you</span>
          </div>
          <div className="birth-grid">
            <div>
              <label className="b-lbl">Birth Date</label>
              <input className="b-input" placeholder="e.g. June 3, 1990"
                value={birthData.date} onChange={e=>setBirthData({...birthData,date:e.target.value})}/>
              <label className="b-lbl">Birth Time</label>
              <input className="b-input" placeholder="e.g. 7:45 PM"
                value={birthData.time} onChange={e=>setBirthData({...birthData,time:e.target.value})}/>
              <label className="b-lbl">Birth Place</label>
              <input className="b-input" placeholder="e.g. Austin, Texas"
                value={birthData.place} onChange={e=>setBirthData({...birthData,place:e.target.value})}/>
              <button className="b-btn" onClick={fetchChart} disabled={chartLoading}>
                {chartLoading?"Calculating your chart... ✨":"Show my houses →"}
              </button>
              {chartError&&<div className="chart-error">{chartError}</div>}
            </div>

            <div>
              {!showHouses&&!chartLoading&&(
                <p className="placeholder-note">
                  Enter your birth data and Keys to the Stars will calculate your rising sign using whole sign houses, then show you which houses today's transiting planets are activating — and what each house governs in your life. No predictions. Just the map of your sky.
                </p>
              )}
              {chartLoading&&(
                <div style={{color:"var(--text-light)",fontStyle:"italic",fontSize:"0.85rem",lineHeight:1.7}}>
                  Calculating your chart from the stars... ✨
                </div>
              )}
              {showHouses&&chartData&&(()=>{
                const planetsArr=chartData.chart_data?.planets||chartData.planets||[];
                const housesArr=chartData.chart_data?.houses||chartData.houses||[];
                const asc=planetsArr.find(p=>["asc","ascendant"].includes(p.name?.toLowerCase()))||housesArr.find(h=>h.number===1);
                const risingSign=asc?.sign?.toLowerCase()||asc?.sign_name?.toLowerCase();
                const risingDisplay=risingSign?cap(risingSign):"Unknown";
                const todayPlanets=todayData?.planets||{};
                const transitList=Object.entries(todayPlanets)
                  .filter(([,v])=>v?.sign)
                  .map(([p,v])=>({name:p,sign:v.sign,symbol:PLANETS[p]?.symbol||""}));
                return (
                  <div>
                    <div className="house-intro">
                      Your rising sign is <strong style={{color:"var(--text-mid)",fontStyle:"normal"}}>
                        {SIGNS[risingSign]?.symbol} {risingDisplay}
                      </strong>. Using whole sign houses, here is where today's planets fall in your chart.
                    </div>
                    {transitList.map((tp,i)=>{
                      const hn=getHouseFromSign(tp.sign,risingSign);
                      const house=hn?HOUSES[hn]:null;
                      if(!house) return null;
                      return (
                        <div key={i} className="house-card">
                          <div className="hc-top">{tp.symbol} {cap(tp.name)} in {SIGNS[tp.sign]?.symbol} {cap(tp.sign)}</div>
                          <div className="hc-name">{house.name} — ruled by {house.ruling_sign}</div>
                          <div className="hc-body">{house.meaning}</div>
                        </div>
                      );
                    })}
                    <div style={{marginTop:"0.75rem",fontSize:"0.7rem",color:"var(--text-light)",fontStyle:"italic"}}>
                      Whole sign houses · {risingDisplay} rising · Calculated via Astrologer API
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

      </div></div>
    </>
  );
}
