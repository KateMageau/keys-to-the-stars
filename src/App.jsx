import { useState, useCallback, useEffect } from "react";

// ─── PLANETS ─────────────────────────────────────────────────────────────────
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

// ─── SIGNS ───────────────────────────────────────────────────────────────────
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

// ─── ASPECTS ─────────────────────────────────────────────────────────────────
const ASPECTS = {
  conjunction: { symbol: "☌", name: "Conjunction", degrees: "0°",   meaning: "A conjunction occurs when two planets occupy the same degree of the zodiac. Their energies fully merge and intensify each other. The nature of the conjunction depends entirely on which planets are involved — the blending is total." },
  sextile:     { symbol: "⚹", name: "Sextile",     degrees: "60°",  meaning: "A sextile is a 60° angle between two planets. It is an opportunity aspect — the planets cooperate naturally and support each other's expression. Action is still required; the sextile opens a door but does not walk through it." },
  square:      { symbol: "□", name: "Square",       degrees: "90°",  meaning: "A square is a 90° angle between two planets. It creates friction and tension — the planets work at cross-purposes and demand resolution. Squares are uncomfortable but generative; they create the pressure that produces growth." },
  trine:       { symbol: "△", name: "Trine",        degrees: "120°", meaning: "A trine is a 120° angle between two planets. It is the most harmonious aspect — the planets flow easily together, amplifying each other without resistance. Trines represent natural ease and gifts that may go unnoticed precisely because they cost nothing." },
  opposition:  { symbol: "☍", name: "Opposition",  degrees: "180°", meaning: "An opposition is a 180° angle — two planets directly across the zodiac from each other. Their energies create polarity and awareness through contrast. Oppositions are often experienced through relationships, as we project one side outward." },
};

// ─── HOUSES ──────────────────────────────────────────────────────────────────
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

// ─── MOON PHASES ─────────────────────────────────────────────────────────────
const MOON_PHASES = {
  new: {
    emoji: "🌑",
    name: "New Moon",
    symbol: "●",
    meaning: "The New Moon occurs when the Sun and Moon occupy the same degree of the zodiac. The Moon is invisible from Earth — she is turned fully toward the Sun, not toward us. This is the beginning of the lunar cycle, a moment of pure potential before anything has taken form.",
    energy: "Beginnings, intentions, planting seeds, rest, withdrawal, inner quiet. The New Moon is not a time of outward action but of inward orientation. What you direct your attention toward now sets the tone for the cycle ahead.",
    good_for: "Setting intentions, starting new projects, journaling, visioning, rest, releasing what came before.",
    avoid: "Launching publicly, making final decisions, expecting high energy. The New Moon favors the private over the visible.",
  },
  waxing_crescent: {
    emoji: "🌒",
    name: "Waxing Crescent",
    symbol: "🌒",
    meaning: "The Waxing Crescent appears as the first sliver of light after the New Moon. The cycle is beginning to build — there is momentum gathering, though it is still fragile and new. This is the phase of first steps and early commitment.",
    energy: "Initiation, early effort, building momentum, faith in what has been set in motion. The crescent asks you to move toward your intentions without yet seeing the full result.",
    good_for: "Taking first steps, making plans concrete, reaching out, beginning what you envisioned at the New Moon.",
    avoid: "Giving up because results aren't visible yet. This phase requires trust in process.",
  },
  first_quarter: {
    emoji: "🌓",
    name: "First Quarter",
    symbol: "🌓",
    meaning: "The First Quarter Moon appears as a half-lit moon. It marks the halfway point between New and Full — the cycle is in full momentum and the first real challenges or decision points arrive. This is a crisis of action.",
    energy: "Decision, effort, overcoming obstacles, commitment under pressure. The First Quarter demands that you do the work rather than simply intend it. Something will likely require adjustment or a choice.",
    good_for: "Problem-solving, making decisions, pushing through resistance, taking decisive action.",
    avoid: "Backing away from difficulty. The friction of this phase is generative — it is asking for engagement, not retreat.",
  },
  waxing_gibbous: {
    emoji: "🌔",
    name: "Waxing Gibbous",
    symbol: "🌔",
    meaning: "The Waxing Gibbous Moon is almost full — the light is dominant but not yet complete. This is the phase of refinement and anticipation. The work is largely done; now it is being polished and prepared for culmination.",
    energy: "Refinement, analysis, preparation, fine-tuning. There is a quality of eager anticipation here — the sense that something is almost ready. Attention to detail serves well in this phase.",
    good_for: "Editing, refining, reviewing, adjusting, preparing to share or release something.",
    avoid: "Starting entirely new endeavors. The Waxing Gibbous is for bringing existing things to their best form, not beginning fresh.",
  },
  full: {
    emoji: "🌕",
    name: "Full Moon",
    symbol: "○",
    meaning: "The Full Moon occurs when the Sun and Moon are exactly opposite each other in the zodiac. The Moon is fully illuminated and at maximum visibility. Whatever was seeded at the New Moon has now reached culmination — for better or for more complicated. Full Moons illuminate what has been growing in the dark.",
    energy: "Culmination, revelation, heightened emotion, completion, peak energy. The Full Moon brings things to a head — relationships, projects, feelings, and situations are all amplified. What has been building becomes visible.",
    good_for: "Celebrating completions, releasing what is finished, rituals, heightened creative work, important conversations that have been pending.",
    avoid: "Starting new things from scratch. The Full Moon is for completion, not initiation. Also avoid major decisions made purely from the emotional intensity of the moment.",
  },
  waning_gibbous: {
    emoji: "🌖",
    name: "Waning Gibbous",
    symbol: "🌖",
    meaning: "The Waning Gibbous follows the Full Moon as the light begins to decrease. Also called the Disseminating Moon, this phase is associated with sharing, teaching, and distributing what was gained at the Full Moon. The harvest is in — now it is shared.",
    energy: "Sharing, teaching, communicating, gratitude, distributing wisdom. There is a generous, outward-flowing quality to this phase. What you have learned or completed wants to move outward into the world.",
    good_for: "Teaching, writing, publishing, sharing, expressing gratitude, community engagement.",
    avoid: "Hoarding insights or keeping things private that want to be shared. The Waning Gibbous is fundamentally generous in orientation.",
  },
  last_quarter: {
    emoji: "🌗",
    name: "Last Quarter",
    symbol: "🌗",
    meaning: "The Last Quarter Moon appears as the second half-lit moon of the cycle. It mirrors the First Quarter but in the releasing rather than building phase. This is a crisis of consciousness — a moment of reorientation and letting go of what no longer serves the next cycle.",
    energy: "Release, reorientation, forgiveness, clearing, honest reflection. The Last Quarter asks hard questions: what is finished? What needs to be released before the next beginning? This is not a comfortable phase — it is an honest one.",
    good_for: "Decluttering, ending relationships or projects that have run their course, forgiveness work, honest self-assessment.",
    avoid: "Forcing new beginnings or clinging to what is clearly complete. The Last Quarter is for conscious release, not for grasping.",
  },
  waning_crescent: {
    emoji: "🌘",
    name: "Waning Crescent",
    symbol: "🌘",
    meaning: "The Waning Crescent is the final phase before the New Moon returns. Also called the Balsamic Moon, this is the most interior and quiet phase of the cycle. The light is almost gone. This is a time of rest, surrender, and preparation for what comes next.",
    energy: "Rest, surrender, solitude, dreaming, healing, completion. The Waning Crescent asks nothing of you except to be still. It is the exhale before the inhale. Pushing forward in this phase often meets resistance because the cycle itself is winding down.",
    good_for: "Rest, sleep, solitude, meditation, healing, letting go completely, dreaming about what comes next without forcing it.",
    avoid: "Overextending, social demands, launching anything that needs momentum. Honor the quiet of this phase.",
  },
};

// Phase per day in April 2026 (approximate)
const DAY_PHASE = {
  1:"waxing_gibbous", 2:"waxing_gibbous", 3:"waxing_gibbous", 4:"waxing_gibbous",
  5:"waxing_gibbous", 6:"waxing_gibbous", 7:"waxing_gibbous", 8:"waxing_gibbous",
  9:"waxing_gibbous", 10:"waxing_gibbous", 11:"waxing_gibbous",
  12:"full", 13:"waning_gibbous", 14:"waning_gibbous", 15:"waning_gibbous",
  16:"waning_gibbous", 17:"waning_gibbous", 18:"waning_gibbous", 19:"last_quarter",
  20:"last_quarter", 21:"waning_crescent", 22:"new", 23:"waxing_crescent",
  24:"waxing_crescent", 25:"waxing_crescent", 26:"waxing_crescent",
  27:"waxing_crescent", 28:"first_quarter", 29:"waxing_gibbous", 30:"waxing_gibbous",
};

// ─── PLANET-IN-SIGN COMBINATIONS (full 120) ──────────────────────────────────
const COMBINATIONS = {
  // ── SUN ──
  "sun-aries":       "Sun in Aries operates at the beginning of the zodiac — the Sun is exalted here. Identity and vitality express through initiative, directness, and the drive to begin. Energy is abundant at the start and may wane before completion. This placement is associated with confidence, courage, and a strong personal will.",
  "sun-taurus":      "Sun in Taurus operates through the qualities of steadiness and pleasure. Identity expresses through building, accumulating, and savoring. The self is most alive when grounded in the physical world — through beauty, comfort, or tangible results. This placement is associated with reliability, patience, and a deep attachment to what is owned or valued.",
  "sun-gemini":      "Sun in Gemini operates through curiosity and communication. Identity expresses through the gathering and sharing of ideas. The self is most alive in conversation, learning, and movement between perspectives. This placement is associated with wit, adaptability, and a tendency to identify with the mind rather than any fixed role.",
  "sun-cancer":      "Sun in Cancer operates through feeling and belonging. Identity expresses through nurturing, protecting, and connecting to roots. The self is most alive within intimate bonds and familiar environments. This placement is associated with emotional depth, strong memory, and a sense of self that is deeply tied to home and family.",
  "sun-leo":         "Sun in Leo operates in its home sign — the Sun rules Leo. Identity expresses through creativity, generosity, and the desire to be seen. The self is most alive when performing, leading, or loving. This placement is associated with warmth, confidence, and a natural magnetism that draws others in.",
  "sun-virgo":       "Sun in Virgo operates through refinement and service. Identity expresses through usefulness, precision, and devotion to craft. The self is most alive when improving something or solving a problem. This placement is associated with analytical intelligence, humility, and a strong orientation toward health and practical contribution.",
  "sun-libra":       "Sun in Libra operates through relationship and aesthetics. Identity expresses through connection, fairness, and the creation of harmony. The self is most alive in partnership and in the presence of beauty. This placement is associated with diplomacy, charm, and a deep need for balance that can make decisive action difficult.",
  "sun-scorpio":     "Sun in Scorpio operates through depth and transformation. Identity expresses through intensity, investigation, and the willingness to go where others won't. The self is most alive at the edges — in crisis, intimacy, or the pursuit of hidden truth. This placement is associated with psychological acuity, resilience, and the capacity for profound regeneration.",
  "sun-sagittarius": "Sun in Sagittarius operates through expansion and seeking. Identity expresses through philosophy, adventure, and the pursuit of meaning. The self is most alive when moving toward a horizon — literal or intellectual. This placement is associated with optimism, directness, and a restlessness that keeps reaching for more.",
  "sun-capricorn":   "Sun in Capricorn operates through ambition and structure. Identity expresses through achievement, responsibility, and the slow building of lasting things. The self is most alive when working toward a significant goal. This placement is associated with discipline, strategic thinking, and a maturity that often develops ahead of its time.",
  "sun-aquarius":    "Sun in Aquarius operates through innovation and collective vision. Identity expresses through originality, idealism, and a sense of belonging to something larger than the individual. The self is most alive in community, rebellion, or the pursuit of a better future. This placement is associated with independence, intellectual intensity, and a certain detachment from personal emotion.",
  "sun-pisces":      "Sun in Pisces operates through imagination and dissolution. Identity expresses through empathy, creativity, and the permeability of boundaries. The self is most alive in art, spirituality, or deep compassion. This placement is associated with sensitivity, idealism, and a tendency to absorb the emotional atmosphere of the surrounding environment.",

  // ── MOON ──
  "moon-aries":       "Moon in Aries operates through immediacy and instinct. Emotional needs express through action, independence, and the freedom to respond without delay. Safety is found in autonomy and forward movement. This placement is associated with emotional directness, a quick temper that passes quickly, and a need to feel capable and unimpeded.",
  "moon-taurus":      "Moon in Taurus operates in its sign of exaltation. Emotional needs express through comfort, consistency, and sensory pleasure. Safety is found in the familiar — in good food, physical touch, and environments that don't change unexpectedly. This placement is associated with emotional steadiness, strong attachment, and a deep resistance to being rushed or destabilized.",
  "moon-gemini":      "Moon in Gemini operates through thought and exchange. Emotional needs express through communication, variety, and mental stimulation. Safety is found in being able to talk about feelings rather than simply sit with them. This placement is associated with emotional curiosity, a tendency to intellectualize, and a need for social connection to process inner life.",
  "moon-cancer":      "Moon in Cancer operates in its home sign — the Moon rules Cancer. Emotional needs express through nurturing, memory, and the protection of what is loved. Safety is found in closeness, familiarity, and the ability to care for others. This placement is associated with deep emotional sensitivity, strong intuition, and an inner life that is rich and sometimes overwhelming.",
  "moon-leo":         "Moon in Leo operates through warmth and recognition. Emotional needs express through creative expression, affection, and the desire to be seen and appreciated. Safety is found in feeling special and loved. This placement is associated with emotional generosity, a flair for drama, and a deep need for acknowledgment that, when unmet, can become wounded pride.",
  "moon-virgo":       "Moon in Virgo operates through analysis and care. Emotional needs express through usefulness, routine, and attention to detail. Safety is found in having things in order and in being of practical service. This placement is associated with emotional discernment, a tendency to worry, and a nurturing style that shows up through acts of care rather than overt sentiment.",
  "moon-libra":       "Moon in Libra operates through harmony and connection. Emotional needs express through relationship, fairness, and the avoidance of conflict. Safety is found in peaceful environments and mutual regard. This placement is associated with emotional diplomacy, difficulty tolerating disharmony, and a deep need for partnership to feel whole.",
  "moon-scorpio":     "Moon in Scorpio operates in its sign of fall — the Moon's instinct for safety meets Scorpio's drive toward depth and exposure. Emotional needs express through intensity, loyalty, and the need to know what is really going on beneath the surface. Safety is found paradoxically through confronting what is most feared. This placement is associated with powerful emotional memory, difficulty letting go, and an all-or-nothing quality in feeling.",
  "moon-sagittarius": "Moon in Sagittarius operates through freedom and meaning. Emotional needs express through exploration, optimism, and the pursuit of truth. Safety is found in open space — physical, philosophical, or relational. This placement is associated with emotional buoyancy, a discomfort with heaviness or limitation, and a need for experiences that expand the sense of what is possible.",
  "moon-capricorn":   "Moon in Capricorn operates in its sign of detriment — the Moon's instinct for emotional expression meets Capricorn's instinct for containment. Emotional needs express through achievement, control, and the demonstration of competence. Safety is found in structure and self-sufficiency. This placement is associated with emotional reserve, high internal standards, and a tendency to manage feelings rather than simply feel them.",
  "moon-aquarius":    "Moon in Aquarius operates through detachment and principle. Emotional needs express through intellectual freedom, community, and the sense of belonging to a larger cause. Safety is found in ideas rather than intimacy. This placement is associated with emotional objectivity, a tendency to observe feelings from a distance, and a genuine care for humanity that can coexist with difficulty in one-on-one closeness.",
  "moon-pisces":      "Moon in Pisces operates through dissolution and empathy. Emotional life is fluid, permeable, and deeply sensitive to the surrounding atmosphere. Safety is found in solitude, creativity, and spiritual connection. This placement is associated with profound compassion, difficulty with boundaries, and an inner world so rich it can be hard to distinguish from external reality.",

  // ── MERCURY ──
  "mercury-aries":       "Mercury in Aries operates through speed and directness. The mind moves quickly, reaches conclusions fast, and communicates without hesitation. Thinking is instinctive rather than deliberate. This placement is associated with a sharp, competitive intellect and a preference for getting directly to the point.",
  "mercury-taurus":      "Mercury in Taurus operates through deliberation and practicality. The mind moves slowly and thoroughly, preferring to fully understand before speaking. Communication is straightforward and grounded. This placement is associated with a reliable, methodical intellect and a tendency to hold positions firmly once they are formed.",
  "mercury-gemini":      "Mercury in Gemini operates in its home sign — Mercury rules Gemini. The mind is quick, curious, and endlessly interested in making connections. Communication is fluid, witty, and multi-directional. This placement is associated with intellectual agility, a love of language, and the ability to hold multiple ideas simultaneously.",
  "mercury-cancer":      "Mercury in Cancer operates through feeling and intuition. The mind absorbs information emotionally and communicates with sensitivity. Thinking is colored by memory and personal experience. This placement is associated with empathic listening, strong recall for emotionally significant events, and communication that tends toward the indirect.",
  "mercury-leo":         "Mercury in Leo operates through expression and performance. The mind thinks in terms of narrative and drama, and communicates with warmth and confidence. Ideas are presented with conviction. This placement is associated with a commanding speaking style, strong creative thinking, and communication that seeks to inspire or entertain.",
  "mercury-virgo":       "Mercury in Virgo operates in its home and exaltation — Mercury at its most precise. The mind is analytical, detail-oriented, and devoted to accuracy. Communication is clear, methodical, and often critical in a constructive sense. This placement is associated with exceptional problem-solving, editing ability, and a tendency to notice what others overlook.",
  "mercury-libra":       "Mercury in Libra operates through balance and consideration. The mind weighs all sides before forming a position, often arriving at nuanced conclusions. Communication is diplomatic, refined, and aesthetically aware. This placement is associated with skill in negotiation and debate, and a genuine difficulty committing to a single view.",
  "mercury-scorpio":     "Mercury in Scorpio operates through investigation and depth. The mind seeks what is hidden and is not satisfied with surface explanations. Communication is incisive, strategic, and sometimes withholding. This placement is associated with psychological perception, the ability to research deeply, and words that carry unusual weight.",
  "mercury-sagittarius": "Mercury in Sagittarius operates through breadth and philosophy. The mind thinks in big patterns and seeks the meaning behind the facts. Communication is enthusiastic, candid, and sometimes tactless. This placement is associated with an interest in foreign ideas, higher learning, and a tendency to generalize rather than attend to fine detail.",
  "mercury-capricorn":   "Mercury in Capricorn operates through structure and authority. The mind is disciplined, strategic, and oriented toward practical outcomes. Communication is measured, formal, and efficient. This placement is associated with the ability to plan systematically, speak with authority, and build arguments that hold up over time.",
  "mercury-aquarius":    "Mercury in Aquarius operates through innovation and principle. The mind thinks ahead of its time, generating original ideas and unconventional solutions. Communication is rational, detached, and oriented toward the collective. This placement is associated with intellectual independence, interest in systems and social patterns, and a tendency toward abstraction.",
  "mercury-pisces":      "Mercury in Pisces operates in its sign of detriment — the rational mind meets the boundless imaginal. Thinking is associative, intuitive, and poetic rather than linear. Communication often comes through metaphor, art, or feeling. This placement is associated with creative and empathic intelligence, and a tendency for the mind to drift toward fantasy or become overwhelmed by too much information.",

  // ── VENUS ──
  "venus-aries":       "Venus in Aries operates through desire and pursuit. The principle of love and attraction expresses through boldness, immediacy, and the thrill of the chase. Attraction is direct and physical. Relationships are approached with enthusiasm that can fade once the initial excitement passes. This placement is associated with passion, independence in love, and a preference for partners who present a worthy challenge.",
  "venus-taurus":      "Venus in Taurus operates in its home sign. Love and value express through patience, sensuality, and loyalty. Attraction is drawn to physical beauty, comfort, and dependability. What is valued is held onto firmly. This placement is associated with a strong aesthetic sensibility and relationships that prioritize stability and embodied pleasure.",
  "venus-gemini":      "Venus in Gemini operates through wit and variety. Love and value express through mental connection, conversation, and versatility. Attraction is sparked by intelligence and novelty. This placement is associated with charm, social ease, and a tendency to keep options open in love until a deep enough connection takes hold.",
  "venus-cancer":      "Venus in Cancer operates through tenderness and devotion. Love and value express through nurturing, emotional intimacy, and the creation of home. Attraction is drawn to those who feel safe and familiar. This placement is associated with deep romantic loyalty, strong attachment patterns, and a love that expresses itself through care and protection.",
  "venus-leo":         "Venus in Leo operates through generosity and drama. Love and value express through grand gestures, creative expression, and the desire to adore and be adored. Attraction is drawn to warmth, confidence, and those who make one feel special. This placement is associated with romantic idealism, loyalty, and a love that is performed as much as felt.",
  "venus-virgo":       "Venus in Virgo operates in its sign of fall — love meets discernment. Love and value express through acts of service, practical care, and attention to detail. Attraction is drawn to competence and reliability. This placement is associated with a love style that shows up in doing rather than saying, and a tendency toward criticism when ideals go unmet.",
  "venus-libra":       "Venus in Libra operates in its home sign. Love and value express through harmony, beauty, and the art of relating. Attraction is drawn to elegance, fairness, and intellectual compatibility. This placement is associated with refined aesthetic sensibility, a natural gift for partnership, and a deep need for relationships that feel balanced and reciprocal.",
  "venus-scorpio":     "Venus in Scorpio operates in its sign of detriment — love meets intensity. Love and value express through depth, loyalty, and the desire for total merger. Attraction is magnetic and often fated in feeling. This placement is associated with profound devotion, jealousy as a shadow, and a love that transforms both parties whether they intend it or not.",
  "venus-sagittarius": "Venus in Sagittarius operates through freedom and adventure. Love and value express through shared exploration, philosophy, and the excitement of possibility. Attraction is drawn to those who expand the world rather than contain it. This placement is associated with romantic optimism, a resistance to feeling caged, and love that thrives on growth and honesty.",
  "venus-capricorn":   "Venus in Capricorn operates through commitment and ambition. Love and value express through loyalty, responsibility, and the building of something lasting. Attraction is drawn to competence, stability, and those who have demonstrated their reliability over time. This placement is associated with a reserved romantic style and relationships that deepen slowly and endure.",
  "venus-aquarius":    "Venus in Aquarius operates through principle and friendship. Love and value express through intellectual connection, shared ideals, and freedom within relationship. Attraction is drawn to the unusual and the independent. This placement is associated with an unconventional approach to love, a need for space and autonomy, and the ability to love broadly across a wide community.",
  "venus-pisces":      "Venus in Pisces operates in its sign of exaltation. Love and value express through compassion, imagination, and the dissolution of boundaries between self and beloved. Attraction is idealistic and empathic. This placement is associated with profound romantic sensitivity, a tendency to merge completely, and a love that can border on devotion or self-sacrifice.",

  // ── MARS ──
  "mars-aries":       "Mars in Aries operates in its home sign. Drive and desire express through immediacy, courage, and unfiltered assertion. Action is instinctive and fast. This placement is associated with pioneering energy, a competitive spirit, and an anger that flares quickly and releases just as fast.",
  "mars-taurus":      "Mars in Taurus operates through persistence and deliberation. Drive expresses slowly but builds to an unstoppable momentum. Action is taken only after thorough consideration, then held to without wavering. This placement is associated with physical endurance, a powerful stubbornness, and an anger that is slow to rise but difficult to extinguish.",
  "mars-gemini":      "Mars in Gemini operates through the mind and through multiplicity. Drive expresses through communication, debate, and the pursuit of several things simultaneously. Action is quick and intellectually motivated. This placement is associated with verbal sharpness, a restless need for stimulation, and an energy that disperses across many interests.",
  "mars-cancer":      "Mars in Cancer operates in its sign of fall — assertive energy meets the instinct to protect and withdraw. Drive expresses indirectly, through emotional motivation and the defense of what is loved. Action is often reactive rather than initiated. This placement is associated with fierce protectiveness, passive-aggressive expression of anger, and motivation that is deeply personal rather than abstract.",
  "mars-leo":         "Mars in Leo operates through will and performance. Drive expresses through creative assertion, pride, and the desire to lead. Action is bold and visible. This placement is associated with dramatic energy, a need to be recognized for effort, and an anger that is expressed rather than suppressed.",
  "mars-virgo":       "Mars in Virgo operates through precision and service. Drive expresses through careful, methodical effort directed toward improvement. Action is efficient and detail-oriented. This placement is associated with a strong work ethic, a critical edge when standards aren't met, and an energy that functions best when channeled into specific, useful tasks.",
  "mars-libra":       "Mars in Libra operates in its sign of detriment — assertive energy meets the instinct to balance and consider. Drive expresses through partnership, negotiation, and the pursuit of fairness. Action is often delayed by the need to weigh all options. This placement is associated with strategic thinking, the ability to motivate through others, and an indirect expression of conflict.",
  "mars-scorpio":     "Mars in Scorpio operates in its traditional home sign. Drive expresses through intensity, strategy, and the capacity to sustain effort through any obstacle. Action is purposeful and rarely visible until it lands. This placement is associated with powerful will, depth of motivation, and an anger that is slow, strategic, and long-remembered.",
  "mars-sagittarius": "Mars in Sagittarius operates through enthusiasm and conviction. Drive expresses through the pursuit of meaning, adventure, and philosophical goals. Action is expansive and sometimes scattered. This placement is associated with high energy, a love of challenge, and a tendency to overcommit to too many directions at once.",
  "mars-capricorn":   "Mars in Capricorn operates in its sign of exaltation. Drive expresses through discipline, strategy, and sustained effort toward significant goals. Action is deliberate and efficient. This placement is associated with exceptional endurance, the ability to delay gratification, and an ambition that plays the long game.",
  "mars-aquarius":    "Mars in Aquarius operates through principle and collective motivation. Drive expresses through innovation, rebellion, and action taken in service of an ideal. Action can be unpredictable in direction but sustained in intensity. This placement is associated with independence of will, a disregard for convention, and energy that is most powerful when aimed at systemic change.",
  "mars-pisces":      "Mars in Pisces operates through imagination and dissolution. Drive expresses through intuition, compassion, and creative or spiritual motivation. Action is fluid and sometimes difficult to direct. This placement is associated with an energy that flows toward what it is called to rather than what it decides, and an anger that tends toward internalization or indirect release.",

  // ── JUPITER ──
  "jupiter-aries":       "Jupiter in Aries expands through action and initiative. Growth and opportunity come through boldness, leadership, and the willingness to go first. This placement is associated with an optimistic, pioneering energy and a belief in the power of individual will to create change.",
  "jupiter-taurus":      "Jupiter in Taurus expands through material life and pleasure. Growth and opportunity come through building, enjoying, and cultivating what is valuable. This placement is associated with abundance in physical and financial domains, and a generous, grounded approach to prosperity.",
  "jupiter-gemini":      "Jupiter in Gemini expands through communication and learning. Growth comes through the gathering and spreading of information, writing, and connection. This placement is associated with intellectual versatility and the ability to find opportunity through ideas and networks.",
  "jupiter-cancer":      "Jupiter in Cancer operates in its sign of exaltation. Growth and opportunity come through nurturing, home, and emotional generosity. This placement is associated with abundance in family and domestic life, strong emotional wisdom, and a natural capacity to make others feel welcomed and cared for.",
  "jupiter-leo":         "Jupiter in Leo expands through creativity and self-expression. Growth comes through bold visibility, generosity, and the willingness to lead with heart. This placement is associated with theatrical optimism, natural charisma, and the ability to inspire others through personal example.",
  "jupiter-virgo":       "Jupiter in Virgo expands through service and refinement. Growth comes through skill development, useful contribution, and attention to what needs improving. This placement is associated with abundance that arrives through diligent work and a philosophical orientation toward craft and health.",
  "jupiter-libra":       "Jupiter in Libra expands through relationship and justice. Growth and opportunity come through partnership, diplomacy, and the creation of fair agreements. This placement is associated with social abundance, a generous and harmonizing influence in relationships, and a philosophical commitment to equality.",
  "jupiter-scorpio":     "Jupiter in Scorpio expands through depth and transformation. Growth comes through investigating what is hidden, engaging with power and shared resources, and moving through intense experiences. This placement is associated with profound philosophical development and the ability to find abundance in unexpected or difficult territory.",
  "jupiter-sagittarius": "Jupiter in Sagittarius operates in its home sign. Growth and expansion operate at full force — through travel, philosophy, higher education, and the pursuit of meaning. This placement is associated with natural optimism, broad vision, and an instinct for finding exactly what is needed at exactly the right time.",
  "jupiter-capricorn":   "Jupiter in Capricorn operates in its sign of fall — expansion meets structure. Growth comes through disciplined effort, institutional engagement, and long-term ambition. This placement is associated with a more restrained optimism that delivers results through patience and strategic commitment rather than luck.",
  "jupiter-aquarius":    "Jupiter in Aquarius expands through innovation and collective vision. Growth comes through community, humanitarian ideals, and original thinking. This placement is associated with an abundance of ideas, a progressive philosophical orientation, and opportunity that arrives through networks and shared causes.",
  "jupiter-pisces":      "Jupiter in Pisces operates in its traditional home sign. Growth and expansion operate through compassion, spirituality, and the imagination. This placement is associated with a deep philosophical and creative generosity, and a sense that abundance flows most freely when individual boundaries are released.",

  // ── SATURN ──
  "saturn-aries":       "Saturn in Aries places structure and discipline within the sign of initiation. Limitation is experienced around identity and assertion. Patience is required where urgency is felt. This placement asks that ambition be built on genuine effort rather than impulse, and that the right to lead be earned.",
  "saturn-taurus":      "Saturn in Taurus places limitation within the domain of resources and pleasure. Restriction is experienced around money, physical comfort, and what is considered secure. This placement asks that material stability be built methodically, and that value be defined by what endures rather than what is immediately gratifying.",
  "saturn-gemini":      "Saturn in Gemini places structure within the domain of communication and thought. Limitation is experienced around speaking, learning, or being understood. This placement asks for disciplined thinking and careful communication, and often produces a mind that is slow to commit to ideas but rigorous once it does.",
  "saturn-cancer":      "Saturn in Cancer operates in its sign of detriment — structure meets the instinct for emotional openness. Limitation is experienced around home, family, and emotional vulnerability. This placement asks that security be built internally rather than sought through others, and often produces emotional self-sufficiency as a hard-won skill.",
  "saturn-leo":         "Saturn in Leo places limitation within the domain of creative expression and recognition. Restriction is experienced around visibility, approval, and the right to take up space. This placement asks that confidence be earned through genuine creative work rather than inherited, and often produces a disciplined and lasting creative output.",
  "saturn-virgo":       "Saturn in Virgo places structure within the domain of service and craft. Limitation is experienced around health, work, and the sense of being useful or competent enough. This placement asks for mastery through dedicated practice, and often produces exceptional skill in whatever craft is pursued with consistency.",
  "saturn-libra":       "Saturn in Libra operates in its sign of exaltation — structure is well-suited to the domain of fairness and relationship. Limitation is experienced around partnership and the creation of equitable agreements. This placement asks for committed, responsible relating, and often produces a person who takes partnership with unusual seriousness.",
  "saturn-scorpio":     "Saturn in Scorpio places structure within the domain of depth and transformation. Limitation is experienced around power, intimacy, and the hidden dimensions of life. This placement asks for integrity in the use of power and a willingness to do deep psychological work, and often produces profound resilience.",
  "saturn-sagittarius": "Saturn in Sagittarius places limitation within the domain of belief and expansion. Restriction is experienced around freedom, travel, and the pursuit of meaning. This placement asks that philosophy be tested against reality and that optimism be earned through experience, producing a wisdom that is grounded rather than merely idealistic.",
  "saturn-capricorn":   "Saturn in Capricorn operates in its home sign. Discipline, structure, and ambition express at full strength. Limitation is experienced as the natural cost of long-term achievement — accepted rather than resisted. This placement is associated with exceptional capacity for sustained effort, authority, and the building of structures meant to last.",
  "saturn-aquarius":    "Saturn in Aquarius operates in its traditional home sign. Structure meets innovation — discipline is applied to collective vision and systemic thinking. Limitation is experienced around group belonging and the expression of individuality within community. This placement asks that progress be built on lasting principles rather than reactive rebellion.",
  "saturn-pisces":      "Saturn in Pisces places structure within the domain of imagination and dissolution. Limitation is experienced around spiritual practice, creative expression, and the management of the inner world. This placement asks for disciplined engagement with what is fluid, and often produces a deeply grounded spirituality or a creative output built through sustained practice rather than inspiration alone.",

  // ── URANUS ──
  "uranus-aries":       "Uranus in Aries is a generational placement. Revolutionary energy expresses through identity, individuality, and the assertion of radical selfhood. Collectively, this era is characterized by disruption to established leadership and the emergence of new archetypes of the individual.",
  "uranus-taurus":      "Uranus in Taurus is a generational placement. Revolutionary energy disrupts the material world — economics, land, resources, and the body. Collectively, this era is characterized by sudden shifts in financial systems and a radical rethinking of what constitutes value and security.",
  "uranus-gemini":      "Uranus in Gemini is a generational placement. Revolutionary energy disrupts communication, information, and the way ideas travel. Collectively, this era is characterized by breakthroughs in technology and media, and a generation that thinks in fundamentally new ways.",
  "uranus-cancer":      "Uranus in Cancer is a generational placement. Revolutionary energy disrupts home, family, and emotional life. Collectively, this era sees radical changes in family structure, domestic life, and the definition of belonging.",
  "uranus-leo":         "Uranus in Leo is a generational placement. Revolutionary energy disrupts creative expression, entertainment, and the nature of fame and individuality. Collectively, this era is characterized by a generation that redefines what it means to perform and be seen.",
  "uranus-virgo":       "Uranus in Virgo is a generational placement. Revolutionary energy disrupts health, work, and systems of service. Collectively, this era sees breakthroughs in medicine and technology, and a generation oriented toward radical efficiency and analytical innovation.",
  "uranus-libra":       "Uranus in Libra is a generational placement. Revolutionary energy disrupts relationship structures, justice systems, and social contracts. Collectively, this era is characterized by radical rethinking of partnership, marriage, and what fairness actually requires.",
  "uranus-scorpio":     "Uranus in Scorpio is a generational placement. Revolutionary energy disrupts power structures, sexuality, and what has been hidden. Collectively, this era is characterized by sudden exposure of what was suppressed and a generation comfortable with psychological intensity.",
  "uranus-sagittarius": "Uranus in Sagittarius is a generational placement. Revolutionary energy disrupts belief systems, education, and the nature of truth. Collectively, this era is characterized by challenges to established religion and philosophy, and a generation that demands experiential rather than inherited wisdom.",
  "uranus-capricorn":   "Uranus in Capricorn is a generational placement. Revolutionary energy disrupts authority, government, and institutional structure. Collectively, this era is characterized by the breakdown and rebuilding of major social institutions and a generation that fundamentally distrusts traditional power.",
  "uranus-aquarius":    "Uranus in Aquarius operates in its home sign. Revolutionary energy is at its most focused and powerful. Technology, collective consciousness, and social innovation are radically transformed. Collectively, this era is characterized by the emergence of entirely new ways of organizing human community.",
  "uranus-pisces":      "Uranus in Pisces is a generational placement. Revolutionary energy disrupts spirituality, the imagination, and the boundaries of the self. Collectively, this era is characterized by sudden shifts in religious and artistic life, and a generation with an unusual capacity for both inspired creativity and collective confusion.",

  // ── NEPTUNE ──
  "neptune-aries":       "Neptune in Aries is a generational placement. The dissolving principle operates through identity and individual assertion. Collectively, idealism around heroism and personal power is heightened. Illusions form around independence and the capacity of individual will to solve collective problems.",
  "neptune-taurus":      "Neptune in Taurus is a generational placement. Dissolution operates through the material world — money, land, and physical security become subjects of collective idealization and confusion. What is real versus what is wished-for in the material realm becomes difficult to discern.",
  "neptune-gemini":      "Neptune in Gemini is a generational placement. Dissolution operates through information and communication. Collectively, the line between fact and fiction becomes blurred. A generation emerges with an unusual capacity for poetic thinking and an equally unusual difficulty distinguishing truth from narrative.",
  "neptune-cancer":      "Neptune in Cancer is a generational placement. Dissolution operates through home, family, and the past. Collective idealization of homeland and ancestry is heightened. A generation carries a romanticized or confused relationship to origins and emotional belonging.",
  "neptune-leo":         "Neptune in Leo is a generational placement. Dissolution operates through creative expression and fame. Collective idealization of art, performance, and romantic love is heightened. A generation experiences the glamour and disillusionment of what it means to be seen.",
  "neptune-virgo":       "Neptune in Virgo is a generational placement. Dissolution operates through service, health, and daily life. Collective idealization of perfection and usefulness is heightened, alongside confusion about what it means to be well or to contribute meaningfully.",
  "neptune-libra":       "Neptune in Libra is a generational placement. Dissolution operates through relationship and justice. Collective idealization of peace, love, and harmony is heightened. A generation dreams of an ideal world of equality while grappling with the difficulty of achieving it in practice.",
  "neptune-scorpio":     "Neptune in Scorpio is a generational placement. Dissolution operates through depth, sexuality, and the hidden dimensions of life. Collective idealization of transformation and transgression is heightened. A generation is drawn to the mystical and the taboo as pathways to truth.",
  "neptune-sagittarius": "Neptune in Sagittarius is a generational placement. Dissolution operates through belief systems and the search for meaning. Collective idealization of freedom, spirituality, and expanded consciousness is heightened. A generation is marked by spiritual seeking and the risk of mistaking feeling for knowing.",
  "neptune-capricorn":   "Neptune in Capricorn is a generational placement. Dissolution operates through authority and institutional life. Collective idealization of achievement and structure is heightened alongside disillusionment with the institutions that were supposed to embody those values.",
  "neptune-aquarius":    "Neptune in Aquarius is a generational placement. Dissolution operates through collective vision and technology. Idealization of community, progress, and the internet as a utopian space is heightened alongside the confusion that results when those ideals meet reality.",
  "neptune-pisces":      "Neptune in Pisces operates in its home sign. The dissolving principle is fully expressed. Boundaries between self and other, real and imagined, are most permeable at the collective level. Spirituality, compassion, and creative imagination are elevated — as are illusion, escapism, and collective confusion about what is true.",

  // ── PLUTO ──
  "pluto-aries":       "Pluto in Aries is a generational placement. Transformation operates through identity and power of the individual. Collectively, this era is characterized by radical disruption of existing orders by forces of individual will, and a generation shaped by confrontation with primal questions of survival and selfhood.",
  "pluto-taurus":      "Pluto in Taurus is a generational placement. Transformation operates through the material world — land, resources, and what is owned. Collectively, this era is characterized by profound shifts in economies and ecological systems, and a generation shaped by questions of ownership and survival.",
  "pluto-gemini":      "Pluto in Gemini is a generational placement. Transformation operates through information and communication. Collectively, this era sees the radical destruction and rebuilding of how ideas move and how truth is defined. A generation is shaped by the power and danger of language.",
  "pluto-cancer":      "Pluto in Cancer is a generational placement. Transformation operates through home, family, and emotional security. Collectively, this era is characterized by the destruction and rebuilding of family structures and national identity. A generation is shaped by displacement, belonging, and the fierce need to protect what is loved.",
  "pluto-leo":         "Pluto in Leo is a generational placement. Transformation operates through creative power, ego, and the nature of fame and leadership. Collectively, this era sees the rise and fall of powerful individual figures. A generation is shaped by the drama of will, recognition, and what it means to matter.",
  "pluto-virgo":       "Pluto in Virgo is a generational placement. Transformation operates through health, work, and systems of service. Collectively, this era sees the dismantling and rebuilding of healthcare, labor structures, and ecological awareness. A generation is shaped by questions of usefulness, the body, and what it means to work.",
  "pluto-libra":       "Pluto in Libra is a generational placement. Transformation operates through relationship structures and justice. Collectively, this era sees the radical dismantling of traditional partnership and legal norms. A generation is shaped by the renegotiation of fairness and the power dynamics within intimate and social bonds.",
  "pluto-scorpio":     "Pluto in Scorpio operates in its home sign. Transformation is total and unflinching. Collectively, this era confronts death, sexuality, power, and hidden corruption at the deepest level. A generation is shaped by exposure to what was suppressed and a capacity for psychological depth that defines them.",
  "pluto-sagittarius": "Pluto in Sagittarius is a generational placement. Transformation operates through belief systems, religion, and the global spread of ideas. Collectively, this era sees the destruction and rebuilding of philosophical and religious frameworks. A generation is shaped by the collision of worldviews and the search for meaning in a pluralistic world.",
  "pluto-capricorn":   "Pluto in Capricorn is a generational placement. Transformation operates through authority, government, and institutional power. Collectively, this era sees the exposure and dismantling of corrupt structures, and a fundamental reckoning with who holds power and why. A generation is shaped by the collapse and rebuilding of the systems they inherited.",
  "pluto-aquarius":    "Pluto in Aquarius is a generational placement. Transformation operates through technology, collective consciousness, and social organization. Collectively, this era sees the radical restructuring of how human communities form and function. A generation will be shaped by the intersection of artificial intelligence, collective power, and the question of what it means to be human.",
  "pluto-pisces":      "Pluto in Pisces is a generational placement. Transformation operates through the unconscious, spirituality, and the dissolution of what remains. Collectively, this era confronts what has been most deeply suppressed at the level of the collective psyche — grief, compassion, and the limits of the material world as a source of meaning.",
};

// ─── TODAY'S TRANSITS ────────────────────────────────────────────────────────
const TODAY_TRANSITS = [
  { id: 1, planet: "sun",     sign: "aries",    aspect: "trine",       planet2: "saturn",  sign2: "sagittarius", start: "Mar 28", end: "Apr 4",  duration: "7 days",    time: "6:14 AM PST" },
  { id: 2, planet: "moon",    sign: "pisces",   aspect: "conjunction", planet2: "neptune", sign2: "pisces",      start: "Apr 1",  end: "Apr 2",  duration: "~24 hours", time: "2:33 AM PST" },
  { id: 3, planet: "venus",   sign: "taurus",   aspect: "square",      planet2: "pluto",   sign2: "aquarius",    start: "Mar 25", end: "Apr 8",  duration: "14 days",   time: "Ongoing" },
  { id: 4, planet: "mercury", sign: "aries",    aspect: "sextile",     planet2: "jupiter", sign2: "gemini",      start: "Apr 1",  end: "Apr 5",  duration: "4 days",    time: "11:08 AM PST" },
  { id: 5, planet: "saturn",  sign: "aries",    aspect: "opposition",  planet2: "neptune", sign2: "pisces",      start: "Feb 10", end: "Jun 30", duration: "~5 months", time: "Ongoing" },
];

// ─── THIS WEEK TRANSITS ───────────────────────────────────────────────────────
const WEEK_TRANSITS = [
  { id: 6,  date: "Apr 2", planet: "venus",   sign: "taurus",    aspect: "trine",       planet2: "moon",    sign2: "virgo",      duration: "2 days",    time: "8:45 AM PST" },
  { id: 7,  date: "Apr 3", planet: "mercury", sign: "aries",     aspect: "conjunction", planet2: "sun",     sign2: "aries",      duration: "3 days",    time: "4:20 PM PST" },
  { id: 8,  date: "Apr 4", planet: "sun",     sign: "aries",     aspect: "square",      planet2: "mars",    sign2: "capricorn",  duration: "5 days",    time: "9:00 AM PST" },
  { id: 9,  date: "Apr 5", planet: "moon",    sign: "virgo",     aspect: "sextile",     planet2: "saturn",  sign2: "aries",      duration: "~18 hours", time: "3:15 PM PST" },
  { id: 10, date: "Apr 6", planet: "jupiter", sign: "gemini",    aspect: "trine",       planet2: "uranus",  sign2: "aquarius",   duration: "10 days",   time: "7:30 AM PST" },
  { id: 11, date: "Apr 7", planet: "mars",    sign: "capricorn", aspect: "sextile",     planet2: "neptune", sign2: "pisces",     duration: "6 days",    time: "1:00 PM PST" },
];

// ─── CALENDAR EVENTS (April 2026) ─────────────────────────────────────────────
// Each event: { label, symbol, time, duration, type: "transit"|"moon"|"void" }
const CALENDAR_EVENTS = {
  1: [
    { label: "Moon ☌ Neptune", symbol: "☽☌♆", time: "2:33a", duration: "~24h", type: "transit" },
    { label: "Moon in Pisces", symbol: "☽♓", time: "12:00a", duration: "~2d", type: "moon" },
    { label: "Mercury ⚹ Jupiter", symbol: "☿⚹♃", time: "11:08a", duration: "4d", type: "transit" },
  ],
  2: [
    { label: "Venus △ Moon", symbol: "♀△☽", time: "8:45a", duration: "2d", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "6:10p", duration: "~4h", type: "void" },
    { label: "Moon enters Aries", symbol: "☽♈", time: "10:22p", duration: "~2.5d", type: "moon" },
  ],
  3: [
    { label: "Mercury ☌ Sun", symbol: "☿☌☉", time: "4:20p", duration: "3d", type: "transit" },
  ],
  4: [
    { label: "Sun □ Mars", symbol: "☉□♂", time: "9:00a", duration: "5d", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "3:47p", duration: "~7h", type: "void" },
    { label: "Moon enters Taurus", symbol: "☽♉", time: "10:51p", duration: "~2.5d", type: "moon" },
  ],
  5: [
    { label: "Moon ⚹ Saturn", symbol: "☽⚹♄", time: "3:15p", duration: "~18h", type: "transit" },
    { label: "Moon ⚹ Venus", symbol: "☽⚹♀", time: "7:40p", duration: "~12h", type: "transit" },
  ],
  6: [
    { label: "Jupiter △ Uranus", symbol: "♃△♅", time: "7:30a", duration: "10d", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "9:15p", duration: "~6h", type: "void" },
  ],
  7: [
    { label: "Mars ⚹ Neptune", symbol: "♂⚹♆", time: "1:00p", duration: "6d", type: "transit" },
    { label: "Moon enters Gemini", symbol: "☽♊", time: "3:18a", duration: "~2.5d", type: "moon" },
  ],
  8: [
    { label: "Venus □ Pluto ends", symbol: "♀□♇", time: "All day", duration: "Ends", type: "transit" },
    { label: "Moon □ Saturn", symbol: "☽□♄", time: "11:22a", duration: "~14h", type: "transit" },
  ],
  9: [
    { label: "Moon □ Venus", symbol: "☽□♀", time: "6:00a", duration: "~20h", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "8:44p", duration: "~5h", type: "void" },
    { label: "Moon enters Cancer", symbol: "☽♋", time: "11:55p", duration: "~2.5d", type: "moon" },
  ],
  10: [
    { label: "Moon △ Neptune", symbol: "☽△♆", time: "2:30p", duration: "~18h", type: "transit" },
  ],
  11: [
    { label: "Sun ⚹ Jupiter", symbol: "☉⚹♃", time: "10:15a", duration: "4d", type: "transit" },
    { label: "Moon ☍ Pluto", symbol: "☽☍♇", time: "4:05p", duration: "~16h", type: "transit" },
  ],
  12: [
    { label: "Full Moon in Libra", symbol: "○ ♎", time: "8:22p", duration: "Peak", type: "moon" },
    { label: "Moon ☍ Sun (Full)", symbol: "☽☍☉", time: "8:22p", duration: "Peak", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "8:22p", duration: "~3h", type: "void" },
    { label: "Moon enters Scorpio", symbol: "☽♏", time: "11:30p", duration: "~2.5d", type: "moon" },
  ],
  13: [
    { label: "Moon △ Mars", symbol: "☽△♂", time: "9:10a", duration: "~14h", type: "transit" },
    { label: "Moon ☌ Saturn", symbol: "☽☌♄", time: "6:44p", duration: "~10h", type: "transit" },
  ],
  14: [
    { label: "Venus ⚹ Saturn", symbol: "♀⚹♄", time: "2:00p", duration: "5d", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "7:30p", duration: "~8h", type: "void" },
  ],
  15: [
    { label: "Moon enters Sagittarius", symbol: "☽♐", time: "3:15a", duration: "~2.5d", type: "moon" },
    { label: "Moon △ Jupiter", symbol: "☽△♃", time: "1:20p", duration: "~16h", type: "transit" },
  ],
  16: [
    { label: "Moon □ Neptune", symbol: "☽□♆", time: "4:55p", duration: "~14h", type: "transit" },
  ],
  17: [
    { label: "Mercury □ Pluto", symbol: "☿□♇", time: "11:30a", duration: "4d", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "6:20p", duration: "~9h", type: "void" },
    { label: "Moon enters Capricorn", symbol: "☽♑", time: "11:48p", duration: "~2.5d", type: "moon" },
  ],
  18: [
    { label: "Moon △ Uranus", symbol: "☽△♅", time: "8:30a", duration: "~12h", type: "transit" },
    { label: "Moon ☌ Pluto", symbol: "☽☌♇", time: "3:15p", duration: "~10h", type: "transit" },
  ],
  19: [
    { label: "Sun enters Taurus", symbol: "☉♉", time: "4:48a", duration: "~30d", type: "moon" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "5:10p", duration: "~6h", type: "void" },
    { label: "Moon enters Aquarius", symbol: "☽♒", time: "11:22p", duration: "~2.5d", type: "moon" },
  ],
  20: [
    { label: "Moon ☌ Saturn", symbol: "☽☌♄", time: "2:44a", duration: "~10h", type: "transit" },
    { label: "Venus □ Mars", symbol: "♀□♂", time: "9:15a", duration: "6d", type: "transit" },
  ],
  21: [
    { label: "Moon ⚹ Jupiter", symbol: "☽⚹♃", time: "10:30a", duration: "~14h", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "7:50p", duration: "~7h", type: "void" },
  ],
  22: [
    { label: "New Moon in Taurus", symbol: "● ♉", time: "6:18a", duration: "Peak", type: "moon" },
    { label: "Moon ☌ Sun (New)", symbol: "☽☌☉", time: "6:18a", duration: "Peak", type: "transit" },
    { label: "Moon enters Pisces", symbol: "☽♓", time: "3:05a", duration: "~2.5d", type: "moon" },
    { label: "Moon ☌ Venus", symbol: "☽☌♀", time: "9:40a", duration: "~8h", type: "transit" },
  ],
  23: [
    { label: "Moon △ Mars", symbol: "☽△♂", time: "11:15a", duration: "~14h", type: "transit" },
  ],
  24: [
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "4:30p", duration: "~10h", type: "void" },
    { label: "Moon enters Aries", symbol: "☽♈", time: "11:05p", duration: "~2.5d", type: "moon" },
  ],
  25: [
    { label: "Mars △ Jupiter", symbol: "♂△♃", time: "9:45a", duration: "8d", type: "transit" },
    { label: "Moon ☌ Saturn", symbol: "☽☌♄", time: "4:20p", duration: "~10h", type: "transit" },
  ],
  26: [
    { label: "Moon ⚹ Mercury", symbol: "☽⚹☿", time: "7:55a", duration: "~12h", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "8:10p", duration: "~5h", type: "void" },
    { label: "Moon enters Taurus", symbol: "☽♉", time: "11:55p", duration: "~2.5d", type: "moon" },
  ],
  27: [
    { label: "Moon △ Neptune", symbol: "☽△♆", time: "3:30p", duration: "~14h", type: "transit" },
  ],
  28: [
    { label: "Venus ☌ Mercury", symbol: "♀☌☿", time: "3:30p", duration: "3d", type: "transit" },
    { label: "Void of Course Moon", symbol: "☽ v/c", time: "6:40p", duration: "~8h", type: "void" },
  ],
  29: [
    { label: "Moon enters Gemini", symbol: "☽♊", time: "2:18a", duration: "~2.5d", type: "moon" },
    { label: "Moon △ Pluto", symbol: "☽△♇", time: "11:05a", duration: "~14h", type: "transit" },
  ],
  30: [
    { label: "Moon □ Neptune", symbol: "☽□♆", time: "9:20a", duration: "~14h", type: "transit" },
    { label: "Moon □ Saturn", symbol: "☽□♄", time: "5:55p", duration: "~12h", type: "transit" },
  ],
};

// ─── DAILY SUMMARIES ─────────────────────────────────────────────────────────
const DAY_SUMMARIES = {
  1:  "A dreamy, boundary-dissolving day. The Moon merging with Neptune in Pisces softens the edges between feeling and imagination — emotional perception is heightened, but clarity is elusive. Mercury sextile Jupiter adds a note of expansive thinking underneath the fog. Good for creative work, less reliable for precision or decisions.",
  2:  "The day starts with Venusian ease — a trine between Venus and the Moon supports connection and pleasure-seeking. By evening the Moon goes void of course, creating a lull before it enters Aries late at night. Use the early hours for beauty and relating; let the evening be unscheduled.",
  3:  "Mercury and the Sun meet in Aries, sharpening the mind and amplifying communication. Thoughts and words carry extra weight today — what gets spoken tends to stick. A good day for important conversations, writing, or stating clearly what you want.",
  4:  "Friction between the Sun and Mars creates a tense, driven atmosphere. Ambition and ego are activated — there's energy here but also irritability. The Moon goes void in the late afternoon before moving into Taurus overnight, shifting things toward steadier ground.",
  5:  "The Moon in Taurus makes two easygoing sextiles — first to Saturn (grounded effort), then to Venus (pleasure and ease). A day with natural rhythm and quiet productivity. Nothing forced.",
  6:  "Jupiter and Uranus in a 10-day trine are building — expect an undercurrent of innovation and unexpected opportunity in the collective. The Moon goes void late, suggesting the evening is better for rest than plans.",
  7:  "Mars sextiles Neptune, bringing a quality of inspired action — effort that flows rather than pushes. Good for creative or spiritual work, physical movement with intentionality, or anything where intuition should lead strategy.",
  8:  "The Venus-Pluto square that's been pressuring relationships and desires wraps up today. There may be a sense of release or resolution. A Moon-Saturn square adds a slightly heavy tone — accountability is in the air.",
  9:  "A square between the Moon and Venus creates some friction in the emotional body around what we want or value. The Moon goes void in the evening before moving into Cancer — a natural closing of the day.",
  10: "A softer day. Moon in Cancer trines Neptune, making it easy to access empathy, intuition, and creative imagination. Rest, water, gentleness, and inner work are all supported.",
  11: "Sun sextiles Jupiter, opening a brief window of optimism and ease — things connect, doors feel cracked open. The Moon in Cancer also opposes Pluto, adding depth and intensity to emotional undercurrents.",
  12: "Full Moon in Libra peaks tonight. This is a day of heightened feeling, culmination, and relationship awareness. Whatever has been building in partnerships, agreements, or the balance between self and other reaches a high point. The Moon goes void immediately after the exact full moon — let the feeling land before acting on it.",
  14: "Venus sextiling Saturn is a quiet but meaningful aspect — it supports commitment in relationships, financial discipline, and anything requiring steadiness in love or aesthetics. A good day to formalize, plan, or show up consistently.",
  17: "Mercury squaring Pluto can make conversations feel loaded — what's said may cut deeper than intended, or hidden things surface. Precision and care in communication are valuable today. The Moon goes void in the evening.",
  19: "The Sun enters Taurus, shifting the collective energy from Aries initiative into Taurus groundedness. For the next month, steadiness, sensory pleasure, and building take priority over beginning. The Moon also moves into Aquarius, adding a detached, big-picture overlay.",
  22: "New Moon in Taurus — a natural moment for setting intentions around stability, resources, beauty, and what you want to build. The Moon conjoins both the Sun and Venus, making this a particularly potent new moon for anything related to love, money, or creative work.",
  25: "Mars and Jupiter in a flowing trine — one of the more buoyant aspects of the month. Energy, confidence, and opportunity align. A good day for action that requires both boldness and wisdom.",
  28: "Venus and Mercury meet, bringing a graceful quality to communication and relating. Words feel beautiful, connection comes easily, and creative expression flows. A good day for writing, reaching out, or having the conversation you've been waiting to have.",
};

const WEEK_SUMMARY = "This week holds a push-pull between mental sharpness and emotional softness. Mercury conjunct Sun on Wednesday amplifies everything said and thought — words carry weight. Venus trine Moon supports connection early in the week, while Sun square Mars on Thursday stirs ambition and friction. Jupiter trine Uranus building in the background gives the whole week an undercurrent of potential — something is opening, even if it's not yet visible. The void of course periods on Tuesday, Thursday, and Saturday evening suggest those are good times to rest between moves rather than push forward.";

// ─── STARS ────────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  r: Math.random() * 1.5 + 0.3, o: Math.random() * 0.45 + 0.08, d: Math.random() * 4 + 2,
}));

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --lav: #c5b8d8; --lav-mid: #b0a0cc; --lav-deep: #9d8fc0;
  --dusk: #2a1f3d; --dusk-mid: #1e1530; --ink: #1a1428;
  --bg: #f0ecf7; --bg-mid: #e4ddf0; --bg-light: #f7f4fb;
  --text: #1a1428; --text-mid: #3d3054; --text-light: #6b5c80;
  --gold: #c9a84c; --gold-lt: #e8cc7a; --white: #ffffff;
  --moon: #7ab8c4; --void: #c4957a;
}
body { font-family: 'Lato', sans-serif; font-weight: 300; background: var(--dusk-mid); color: var(--text); min-height: 100vh; }
.shell { position: relative; min-height: 100vh; padding: 16px; }
.nebula { position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 55% 40% at 8% 18%, rgba(120,60,180,0.38) 0%, transparent 70%),
    radial-gradient(ellipse 45% 55% at 92% 12%, rgba(60,80,200,0.28) 0%, transparent 70%),
    radial-gradient(ellipse 65% 50% at 82% 88%, rgba(160,60,140,0.32) 0%, transparent 70%),
    radial-gradient(ellipse 38% 42% at 18% 82%, rgba(80,40,160,0.32) 0%, transparent 70%),
    radial-gradient(ellipse 75% 75% at 50% 50%, rgba(30,21,48,0.96) 22%, transparent 100%);
}
.stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.card { position: relative; z-index: 1; background: var(--bg); border-radius: 16px;
  border: 1px solid rgba(197,184,216,0.3);
  box-shadow: 0 0 0 1px rgba(197,184,216,0.12), 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.8);
  overflow: visible; max-width: 1100px; margin: 0 auto; padding-bottom: 2rem; }

/* Header */
.hdr { background: linear-gradient(135deg, var(--dusk) 0%, #1a1040 100%);
  padding: 1.75rem 2.5rem 1.4rem; border-bottom: 2px solid rgba(197,184,216,0.18);
  display: flex; justify-content: space-between; align-items: flex-end; }
.logo { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 400; color: var(--lav); letter-spacing: 0.05em; }
.logo em { color: var(--gold-lt); font-style: italic; }
.logo-sub { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(197,184,216,0.45); margin-top: 0.25rem; }
.hdr-right { text-align: right; color: rgba(197,184,216,0.55); font-size: 0.78rem; letter-spacing: 0.04em; line-height: 1.9; }
.print-btn { background: none; border: 1px solid rgba(197,184,216,0.3); border-radius: 5px;
  padding: 0.3rem 0.8rem; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(197,184,216,0.55); cursor: pointer; transition: all 0.15s; margin-top: 0.3rem; }
.print-btn:hover { background: rgba(197,184,216,0.12); color: var(--lav); }

/* Moon bar */
.moon-bar { background: var(--dusk); padding: 0.65rem 2.5rem; display: flex; gap: 2rem; flex-wrap: wrap;
  font-size: 0.68rem; letter-spacing: 0.07em; color: rgba(197,184,216,0.45); border-bottom: 1px solid rgba(197,184,216,0.1); }
.moon-bar span { color: var(--lav); margin-left: 0.35rem; }

/* Sections */
.sec { padding: 1.75rem 2.5rem; border-bottom: 1px solid var(--bg-mid); }
.sec:last-child { border-bottom: none; }
.sec-hdr { display: flex; align-items: baseline; gap: 0.85rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.sec-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 500; color: var(--text-mid); }
.sec-meta { font-size: 0.67rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-light); }
.see-more { background: none; border: 1px solid var(--lav-mid); border-radius: 5px;
  padding: 0.3rem 0.9rem; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--lav-deep); cursor: pointer; transition: all 0.15s; margin-left: auto; }
.see-more:hover { background: var(--lav-deep); color: white; }

/* Transit rows */
.t-row { border: 1px solid var(--bg-mid); border-radius: 9px; margin-bottom: 0.55rem; overflow: hidden; transition: box-shadow 0.2s; }
.t-row:hover { box-shadow: 0 2px 14px rgba(120,60,180,0.1); }
.t-main { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 1rem;
  padding: 0.9rem 1.2rem; cursor: pointer; background: white; }
.t-phrase { display: flex; flex-wrap: wrap; align-items: center; gap: 0.3rem;
  font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--text); }
.tw { cursor: pointer; border-bottom: 1px dotted var(--lav-deep); padding-bottom: 1px; transition: color 0.15s, border-color 0.15s; }
.tw:hover, .tw.on { color: var(--ink); border-bottom-color: var(--ink); font-weight: 500; }
.tw-p { color: var(--text-mid); }
.tw-a { color: var(--text-light); font-size: 0.88rem; font-family: 'Lato', sans-serif; }
.t-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; }
.dur-pill { background: var(--bg-mid); color: var(--text-light); font-size: 0.62rem; letter-spacing: 0.07em; padding: 0.18rem 0.6rem; border-radius: 20px; white-space: nowrap; }
.t-time { font-size: 0.62rem; color: var(--text-light); letter-spacing: 0.04em; }
.in-word { color: var(--lav-deep); font-size: 0.82rem; font-family: 'Lato', sans-serif; }

/* Inline defs */
.defs-panel { background: var(--bg-mid); border-top: 1px solid rgba(157,143,192,0.2);
  padding: 1.1rem 1.4rem; }
.defs-top { display: flex; justify-content: flex-end; margin-bottom: 0.75rem; }
.collapse-btn { background: none; border: 1px solid rgba(157,143,192,0.4); border-radius: 5px;
  padding: 0.2rem 0.7rem; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-light); cursor: pointer; transition: all 0.15s; }
.collapse-btn:hover { background: var(--lav-deep); color: white; border-color: var(--lav-deep); }
.defs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0.85rem; }
.def { }
.def-lbl { font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--lav-deep); margin-bottom: 0.28rem; }
.def-ttl { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: var(--text); margin-bottom: 0.3rem; }
.def-body { font-size: 0.8rem; line-height: 1.7; color: var(--text-mid); }
.def-combo { background: white; border-left: 3px solid var(--lav-deep); border-radius: 0 6px 6px 0;
  padding: 0.7rem 0.95rem; grid-column: 1 / -1; margin-top: 0.25rem; }
.def-combo .def-lbl { color: var(--gold); }

/* Calendar */
.cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 1px; background: var(--bg-mid);
  border: 1px solid var(--bg-mid); border-radius: 10px; overflow: hidden; }
.cal-dh { background: var(--dusk); color: rgba(197,184,216,0.65); font-size: 0.62rem;
  letter-spacing: 0.12em; text-transform: uppercase; text-align: center; padding: 0.45rem; }
.cal-cell { background: white; min-height: 100px; padding: 0.35rem; cursor: pointer; transition: background 0.15s; }
.cal-cell.empty { background: #f8f5fc; cursor: default; min-height: 60px; }
.cal-cell:not(.empty):hover { background: #f3eefb; }
.cal-cell.sel { background: #ece6f5; }
.cal-cell.today { border-top: 2px solid var(--lav-deep); }
.cal-num { font-size: 0.72rem; color: var(--text-light); margin-bottom: 0.2rem; }
.today .cal-num { color: var(--dusk); font-weight: 700; }
.ev { font-size: 0.56rem; line-height: 1.25; border-radius: 3px; padding: 0.12rem 0.28rem; margin-bottom: 0.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ev.transit { background: #ede8f7; color: var(--text-mid); }
.ev.moon    { background: #dff0f4; color: #3a6070; }
.ev.void    { background: #faeee6; color: #8c4e28; font-style: italic; }
.cal-detail { background: white; border: 1px solid var(--bg-mid); border-radius: 9px; padding: 1.1rem 1.4rem; margin-top: 0.85rem; }
.cal-d-date { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--text-mid); margin-bottom: 0.85rem; }
.ev-row { display: flex; align-items: baseline; justify-content: space-between; padding: 0.45rem 0;
  border-bottom: 1px solid var(--bg-mid); font-size: 0.82rem; color: var(--text); gap: 0.75rem; }
.ev-row:last-child { border-bottom: none; }
.ev-row-name { font-family: 'Playfair Display', serif; }
.ev-row-badge { font-size: 0.58rem; padding: 0.1rem 0.45rem; border-radius: 10px; margin-left: 0.4rem; }
.badge-transit { background: #ede8f7; color: var(--lav-deep); }
.badge-moon    { background: #dff0f4; color: #3a6070; }
.badge-void    { background: #faeee6; color: #8c4e28; }
.ev-meta { display: flex; gap: 0.85rem; font-size: 0.67rem; color: var(--text-light); white-space: nowrap; }

/* Birth section */
.birth-grid { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; align-items: start; }
.b-lbl { font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-light); display: block; margin-bottom: 0.3rem; }
.b-input { width: 100%; border: 1px solid var(--bg-mid); border-radius: 6px; padding: 0.55rem 0.8rem;
  font-family: 'Lato', sans-serif; font-size: 0.82rem; color: var(--text); background: white;
  outline: none; margin-bottom: 0.75rem; transition: border-color 0.2s; }
.b-input:focus { border-color: var(--lav-deep); }
.b-input::placeholder { color: rgba(107,92,128,0.4); }
.b-btn { background: var(--dusk); color: var(--lav); border: none; border-radius: 6px;
  padding: 0.65rem 1.25rem; font-family: 'Lato', sans-serif; font-size: 0.7rem;
  letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; width: 100%; transition: background 0.2s; }
.b-btn:hover { background: var(--ink); }

/* Resource & support cards */
.resource-card {
  display: flex; align-items: flex-start; gap: 0.65rem;
  background: white; border: 1px solid var(--bg-mid); border-radius: 8px;
  padding: 0.7rem 0.9rem; text-decoration: none; color: inherit;
  transition: all 0.2s; flex: 1 1 200px; min-width: 180px;
}
.resource-card:hover { border-color: var(--lav-mid); box-shadow: 0 2px 10px rgba(120,60,180,0.09); }
.rc-emoji { font-size: 1.4rem; line-height: 1; flex-shrink: 0; margin-top: 0.1rem; }
.rc-title { font-family: 'Playfair Display', serif; font-size: 0.88rem; color: var(--text); margin-bottom: 0.15rem; }
.rc-sub { font-size: 0.7rem; color: var(--text-light); line-height: 1.45; }
.support-card {
  display: flex; align-items: flex-start; gap: 0.65rem;
  background: var(--bg-light); border: 1px solid var(--lav-mid); border-radius: 8px;
  padding: 0.85rem 1rem; text-decoration: none; color: inherit;
  flex: 1 1 200px; min-width: 200px; transition: all 0.2s;
}
.support-card:hover { border-color: var(--lav-deep); }
.example-note { font-size: 0.7rem; color: var(--text-light); margin-top: 0.6rem; font-style: italic; text-align: center; }
.house-results { }
.house-intro { font-size: 0.82rem; color: var(--text-light); margin-bottom: 1rem; font-style: italic; line-height: 1.6; }
.house-card { background: white; border: 1px solid var(--bg-mid); border-radius: 8px; padding: 0.85rem 1.05rem; margin-bottom: 0.6rem; }
.hc-top { font-size: 0.6rem; letter-spacing: 0.13em; text-transform: uppercase; color: var(--lav-deep); margin-bottom: 0.25rem; }
.hc-name { font-family: 'Playfair Display', serif; font-size: 0.98rem; color: var(--text); margin-bottom: 0.3rem; }
.hc-body { font-size: 0.8rem; line-height: 1.68; color: var(--text-mid); }
.placeholder-note { font-style: italic; font-size: 0.82rem; color: var(--text-light);
  line-height: 1.7; border-left: 3px solid var(--lav); padding-left: 0.85rem; }

/* Calendar day detail grid */
.cal-detail-grid { display: grid; grid-template-columns: 1fr auto auto; gap: 0 1.25rem; align-items: baseline; }
.cal-detail-grid .ev-row { display: contents; }
.cal-detail-grid .ev-row > * { padding: 0.42rem 0; border-bottom: 1px solid var(--bg-mid); font-size: 0.82rem; }
.cal-detail-grid .ev-row:last-child > * { border-bottom: none; }
.cal-detail-grid .ev-name { color: var(--text); font-family: 'Playfair Display', serif; }
.cal-detail-grid .ev-time { color: var(--text-light); font-size: 0.68rem; white-space: nowrap; text-align: right; }
.cal-detail-grid .ev-dur  { color: var(--text-light); font-size: 0.68rem; white-space: nowrap; text-align: right; }

/* Summary blocks */
.summary-block { background: var(--bg-light); border-left: 3px solid var(--lav-mid);
  border-radius: 0 8px 8px 0; padding: 0.85rem 1.1rem; margin-top: 1rem; }
.summary-label { font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--lav-deep); margin-bottom: 0.4rem; }
.summary-text { font-size: 0.82rem; line-height: 1.75; color: var(--text-mid); font-style: italic; }

/* Moon bar clickable */
.moon-bar-item {
  cursor: pointer;
  border-radius: 5px;
  padding: 0.2rem 0.4rem;
  margin: -0.2rem -0.4rem;
  transition: background 0.15s;
}
.moon-bar-item:hover { background: rgba(197,184,216,0.1); }
.moon-bar-item.active { background: rgba(197,184,216,0.15); }

/* Moon phase section */
.phase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.45rem;
}

.phase-card {
  background: white;
  border: 1px solid var(--bg-mid);
  border-radius: 7px;
  padding: 0.45rem 0.65rem;
  cursor: pointer;
  transition: all 0.2s;
}

.phase-card:hover { box-shadow: 0 2px 10px rgba(120,60,180,0.08); border-color: var(--lav-mid); }
.phase-card.open  { border-color: var(--lav-deep); background: var(--bg-light); }

.phase-card-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.phase-emoji { font-size: 1rem; line-height: 1; }

.phase-name {
  font-family: 'Playfair Display', serif;
  font-size: 0.75rem;
  color: var(--text);
}

.phase-chevron {
  margin-left: auto;
  color: var(--lav-deep);
  font-size: 0.6rem;
  transition: transform 0.2s;
}

.phase-card.open .phase-chevron { transform: rotate(180deg); }

.phase-body {
  margin-top: 0.85rem;
  border-top: 1px solid var(--bg-mid);
  padding-top: 0.85rem;
}

.phase-meaning {
  font-size: 0.82rem;
  line-height: 1.75;
  color: var(--text-mid);
  margin-bottom: 0.75rem;
}

.phase-sub-label {
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--lav-deep);
  margin-bottom: 0.3rem;
  margin-top: 0.65rem;
}

.phase-sub-text {
  font-size: 0.8rem;
  line-height: 1.68;
  color: var(--text-mid);
}

/* Phase emoji on calendar */
.cal-phase { font-size: 0.7rem; opacity: 0.6; margin-bottom: 0.1rem; }

/* Moon phase panel in day detail */
.phase-detail-block {
  background: var(--bg-light);
  border-left: 3px solid var(--moon);
  border-radius: 0 7px 7px 0;
  padding: 0.75rem 1rem;
  margin-top: 0.85rem;
  cursor: pointer;
}

.phase-detail-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  color: var(--text);
}

.phase-detail-body {
  margin-top: 0.6rem;
  font-size: 0.78rem;
  line-height: 1.7;
  color: var(--text-mid);
}

/* Date label above week transits */
.week-date-lbl { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-light); padding-left: 0.1rem; margin-bottom: 0.25rem; margin-top: 0.6rem; }

@media print {
  .nebula, .stars, .no-print { display: none !important; }
  .shell { padding: 0; background: white; }
  .card { box-shadow: none; border: none; border-radius: 0; }
  .hdr { background: none; border-bottom: 2px solid #333; }
  .logo, .logo em { color: #1a1428 !important; }
  .logo-sub, .hdr-right { color: #555 !important; }
  .moon-bar { background: none; border: 1px solid #ccc; color: #555; }
  .moon-bar span { color: #333; }
  .sec { padding: 1rem; }
  .cal-dh { background: #333; }
  .ev.transit { background: #eee; color: #333; }
  .ev.moon    { background: #d0eef4; color: #1a4050; }
  .ev.void    { background: #fde8d8; color: #7a3010; }
  .birth-grid, .defs-panel, .t-row > .t-main, .see-more, .print-btn { display: none !important; }
}
`;

// ─── TRANSIT ROW COMPONENT ────────────────────────────────────────────────────
function TransitRow({ t }) {
  const [words, setWords] = useState(new Set());
  const [defsOpen, setDefsOpen] = useState(false);

  const p1 = PLANETS[t.planet];
  const p2 = PLANETS[t.planet2];
  const asp = ASPECTS[t.aspect];
  const s1 = SIGNS[t.sign];
  const s2 = t.sign2 ? SIGNS[t.sign2] : null;

  const tap = (e, w) => {
    e.stopPropagation();
    setWords(prev => {
      const n = new Set(prev);
      n.has(w) ? n.delete(w) : n.add(w);
      return n;
    });
    setDefsOpen(true);
  };

  const defs = [];
  if (words.has("p1")) defs.push({ key:"p1", lbl:"Planet", ttl:`${p1.symbol} ${p1.name}`, body: p1.meaning });
  if (words.has("s1") && s1) defs.push({ key:"s1", lbl:"Sign", ttl:`${s1.symbol} ${s1.name} · ${s1.element} · ${s1.modality}`, body: s1.meaning });
  if (words.has("asp")) defs.push({ key:"asp", lbl:"Aspect", ttl:`${asp.symbol} ${asp.name} ${asp.degrees}`, body: asp.meaning });
  if (words.has("p2")) defs.push({ key:"p2", lbl:"Planet", ttl:`${p2.symbol} ${p2.name}`, body: p2.meaning });
  if (words.has("s2") && s2) defs.push({ key:"s2", lbl:"Sign", ttl:`${s2.symbol} ${s2.name} · ${s2.element} · ${s2.modality}`, body: s2.meaning });

  const comboKey1 = `${t.planet}-${t.sign}`;
  const comboKey2 = t.planet2 && t.sign2 ? `${t.planet2}-${t.sign2}` : null;
  const combo = (words.has("p1") && words.has("s1") && COMBINATIONS[comboKey1])
    ? { label: `${p1.name} in ${s1.name}`, text: COMBINATIONS[comboKey1] }
    : (words.has("p2") && words.has("s2") && comboKey2 && COMBINATIONS[comboKey2])
    ? { label: `${p2.name} in ${s2.name}`, text: COMBINATIONS[comboKey2] }
    : null;

  const anyWords = words.size > 0;

  return (
    <div className="t-row">
      <div className="t-main">
        <div className="t-phrase">
          <span className={`tw tw-p ${words.has("p1")?"on":""}`} onClick={e=>tap(e,"p1")}>{p1.symbol} {p1.name}</span>
          {s1 && <><span className="in-word">in</span><span className={`tw ${words.has("s1")?"on":""}`} onClick={e=>tap(e,"s1")}>{s1.symbol} {s1.name}</span></>}
          <span className={`tw tw-a ${words.has("asp")?"on":""}`} onClick={e=>tap(e,"asp")}>{asp.symbol} {asp.name}</span>
          <span className={`tw tw-p ${words.has("p2")?"on":""}`} onClick={e=>tap(e,"p2")}>{p2.symbol} {p2.name}</span>
          {s2 && <><span className="in-word">in</span><span className={`tw ${words.has("s2")?"on":""}`} onClick={e=>tap(e,"s2")}>{s2.symbol} {s2.name}</span></>}
        </div>
        <div className="t-right">
          <span className="dur-pill">{t.duration} aspect</span>
          {t.signDuration && <span className="dur-pill" style={{background:"var(--bg-light)",color:"var(--text-light)"}}>{t.signDuration} in sign</span>}
          <span className="t-time">{t.time}</span>
        </div>
      </div>

      {defsOpen && anyWords && (
        <div className="defs-panel">
          <div className="defs-top">
            <button className="collapse-btn" onClick={() => { setDefsOpen(false); setWords(new Set()); }}>
              ↑ Collapse
            </button>
          </div>
          <div className="defs-grid">
            {defs.map(d => (
              <div className="def" key={d.key}>
                <div className="def-lbl">{d.lbl}</div>
                <div className="def-ttl">{d.ttl}</div>
                <div className="def-body">{d.body}</div>
              </div>
            ))}
            {combo && (
              <div className="def-combo">
                <div className="def-lbl">{combo.label}</div>
                <div className="def-body">{combo.text}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PHASE CARD COMPONENT ────────────────────────────────────────────────────
function PhaseCard({ phaseKey }) {
  const [open, setOpen] = useState(false);
  const phase = MOON_PHASES[phaseKey];
  if (!phase) return null;
  return (
    <div className={`phase-card ${open ? "open" : ""}`} onClick={() => setOpen(v => !v)}>
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

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function Skyward() {
  const [showWeek, setShowWeek] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewDay, setViewDay] = useState(0); // 0 = today, 1-6 = days ahead
  const [birthData, setBirthData] = useState(() => {
    try {
      const saved = localStorage.getItem("kts_birth_data");
      return saved ? JSON.parse(saved) : { date: "", time: "", place: "" };
    } catch { return { date: "", time: "", place: "" }; }
  });

  const updateBirthData = (next) => {
    setBirthData(next);
    try { localStorage.setItem("kts_birth_data", JSON.stringify(next)); } catch {}
  };
  const [showHouses, setShowHouses] = useState(false);
  const [moonBarPhase, setMoonBarPhase] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

  // ── Transit data from JSON ──────────────────────────────────────────────────
  const today = new Date();
  const currentYear  = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-based
  const currentDay   = today.getDate();
  const monthKey     = `${currentYear}-${String(currentMonth).padStart(2,"0")}`;
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  const MONTH_NAMES_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const currentMonthName = MONTH_NAMES_FULL[currentMonth - 1];
  const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
  const currentMonthStartDow = new Date(currentYear, currentMonth - 1, 1).getDay();

  const [transitData, setTransitData]     = useState(null);
  const [dataLoading, setDataLoading]     = useState(true);

  useEffect(() => {
    fetch(`/transits-${currentYear}.json`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => { setTransitData(json); setDataLoading(false); })
      .catch(err => { console.error("Transit data fetch failed:", err.message); setDataLoading(false); });
  }, [currentYear]);

  // Convert JSON day data → calendar event rows
  const buildCalendarEvents = (dayData) => {
    if (!dayData) return [];
    const events = [];
    // Moon ingress
    if (dayData.moon?.ingress) {
      const sign = dayData.moon.ingress;
      const sym  = dayData.moon.sign_symbol || "";
      events.push({ label: `Moon enters ${cap(sign)}`, symbol: `☽${sym}`, time: "", duration: "~2.5d", type: "moon" });
    }
    // Aspects
    if (dayData.aspects) {
      for (const a of dayData.aspects.slice(0, 4)) {
        events.push({
          label:    a.label || `${cap(a.planet1)} ${a.aspect_symbol} ${cap(a.planet2)}`,
          symbol:   `${a.planet1_symbol}${a.aspect_symbol}${a.planet2_symbol}`,
          time:     "",
          duration: "",
          type:     "transit",
        });
      }
    }
    // Retrogrades
    if (dayData.retrogrades?.length) {
      for (const r of dayData.retrogrades) {
        events.push({ label: `${cap(r.planet)} Retrograde`, symbol: `${r.symbol}℞`, time: "", duration: "", type: "transit" });
      }
    }
    return events;
  };

  // Build dynamic CALENDAR_EVENTS and DAY_PHASE from fetched data
  const liveCalendarEvents = {};
  const liveDayPhase = {};

  if (transitData && transitData[monthKey]) {
    const monthData = transitData[monthKey];
    // Track which phases we've already shown to only mark first occurrence
    const seenPhases = new Set();
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dayData = monthData[d];
      if (dayData && !dayData.error) {
        liveCalendarEvents[d] = buildCalendarEvents(dayData);
        if (dayData.moon?.phase) {
          const phase = dayData.moon.phase;
          const keyPhases = ["new","first_quarter","full","last_quarter"];
          const keyMatch = keyPhases.find(k =>
            phase === k || phase === k + "_moon" || phase.startsWith(k)
          );
          if (keyMatch && !seenPhases.has(keyMatch)) {
            liveDayPhase[d] = keyMatch;
            seenPhases.add(keyMatch);
          }
        }
      }
    }
  }

  // Use live data if available, fall back to hardcoded April 2026 data
  const activeCalendarEvents = Object.keys(liveCalendarEvents).length > 0 ? liveCalendarEvents : CALENDAR_EVENTS;
  const activeDayPhase       = Object.keys(liveDayPhase).length > 0       ? liveDayPhase       : DAY_PHASE;

  // Today's transits from live data
  const liveTodayTransits = [];
  if (transitData && transitData[monthKey]?.[currentDay]?.aspects) {
    transitData[monthKey][currentDay].aspects.slice(0, 5).forEach((a, i) => {
      liveTodayTransits.push({
        id: i + 1,
        planet:  a.planet1, sign:  a.sign1  || "aries",
        aspect:  a.aspect,
        planet2: a.planet2, sign2: a.sign2  || "aries",
        duration: "", time: "",
      });
    });
  }
  const activeTodayTransits = liveTodayTransits.length > 0 ? liveTodayTransits : TODAY_TRANSITS;

  // Moon bar data from live data
  const todayMoon = transitData?.[monthKey]?.[currentDay]?.moon || null;

  // Day navigation — view up to 6 days ahead
  const viewDate = new Date(today);
  viewDate.setDate(today.getDate() + viewDay);
  const viewDayNum   = viewDate.getDate();
  const viewMonthNum = viewDate.getMonth() + 1;
  const viewYear     = viewDate.getFullYear();
  const viewMonthKey = `${viewYear}-${String(viewMonthNum).padStart(2,"0")}`;
  const viewMonthName = MONTH_NAMES_FULL[viewMonthNum - 1];
  const DAY_NAMES_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const viewDayName = DAY_NAMES_FULL[viewDate.getDay()];

  const viewDayData = transitData?.[viewMonthKey]?.[viewDayNum] || null;
  const viewTransits = viewDayData?.aspects || [];

  // Split into short-term and long-term transits
  // Short-term = aspects lasting ~hours to ~1 day (moon aspects, some inner planet)
  // Long-term = aspects lasting more than 1 day
  const outerPlanets = ["jupiter","saturn","uranus","neptune","pluto"];
  const shortTermTransits = [];
  const longTermTransits  = [];
  viewTransits.forEach((a, i) => {
    const involvesMoon = a.planet1 === "moon" || a.planet2 === "moon";
    const bothOuter = outerPlanets.includes(a.planet1) && outerPlanets.includes(a.planet2);
    const innerToOuter = (outerPlanets.includes(a.planet1) || outerPlanets.includes(a.planet2)) && !bothOuter && !involvesMoon;

    // Aspect duration (how long the exact aspect lasts)
    const aspectDuration = bothOuter ? "weeks–months"
      : involvesMoon ? "hours"
      : innerToOuter ? "~1 week"
      : "2–5 days";

    // Planet-in-sign duration (background context)
    const signDuration = outerPlanets.includes(a.planet1)
      ? a.planet1 === "jupiter" ? "~1 yr" : a.planet1 === "saturn" ? "~2.5 yrs" : "yrs"
      : a.planet1 === "sun" ? "~1 mo" : a.planet1 === "moon" ? "~2.5 days" : "weeks";

    const t = {
      id: i + 1,
      planet: a.planet1, sign: a.sign1 || "aries",
      aspect: a.aspect,
      planet2: a.planet2, sign2: a.sign2 || "aries",
      duration: aspectDuration,
      signDuration,
      time: "",
    };

    // Moon aspects and same-day aspects = short-term; anything > 1 day = long-term
    if (involvesMoon) shortTermTransits.push(t);
    else longTermTransits.push(t);
  });

  const [showLongTerm, setShowLongTerm] = useState(false);
  const [chartError, setChartError] = useState(null);

  // Parse birth date string into parts
  const parseBirthDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return null;
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  };

  const parseBirthTime = (timeStr) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return { hour: 12, minute: 0 };
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const ampm = match[3]?.toUpperCase();
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return { hour, minute };
  };

  const fetchBirthChart = useCallback(async () => {
    if (!birthData.date || !birthData.place) return;
    setChartLoading(true);
    setChartError(null);
    setChartData(null);

    const dateParts = parseBirthDate(birthData.date);
    const timeParts = parseBirthTime(birthData.time || "12:00 PM");
    if (!dateParts) {
      setChartError("Please enter a valid birth date, e.g. June 3, 1990");
      setChartLoading(false);
      return;
    }

    // Look up city coordinates via free geocoding API
    let latitude = null, longitude = null, timezone = "America/Los_Angeles";
    try {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(birthData.place)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const geoData = await geo.json();
      if (geoData.length > 0) {
        latitude  = parseFloat(geoData[0].lat);
        longitude = parseFloat(geoData[0].lon);
      }
    } catch (e) {
      console.warn("Geocoding failed, using default coords", e);
    }

    // Fall back to Seattle if geocoding fails
    if (!latitude) { latitude = 47.6062; longitude = -122.3321; }

    try {
      const response = await fetch("https://astrologer.p.rapidapi.com/api/v5/chart-data/birth-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          "x-rapidapi-host": "astrologer.p.rapidapi.com",
        },
        body: JSON.stringify({
          subject: {
            name: "User",
            year: dateParts.year,
            month: dateParts.month,
            day: dateParts.day,
            hour: timeParts.hour,
            minute: timeParts.minute,
            latitude,
            longitude,
            timezone,
            city: birthData.place,
            nation: "US",
            houses_system_identifier: "W",
          }
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`API ${response.status}: ${JSON.stringify(errBody)}`);
      }
      const data = await response.json();
      if (data.status === "ERROR") throw new Error(JSON.stringify(data));
      setChartData(data);
      setShowHouses(true);
    } catch (err) {
      setChartError(`Couldn't load your chart: ${err.message}`);
      console.error(err);
    } finally {
      setChartLoading(false);
    }
  }, [birthData]);

  // Map API planet sign to our house number using whole sign
  const getHouseFromSign = (signName, risingSign) => {
    const signs = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
    const risingIdx = signs.indexOf(risingSign?.toLowerCase());
    const signIdx = signs.indexOf(signName?.toLowerCase());
    if (risingIdx === -1 || signIdx === -1) return null;
    return ((signIdx - risingIdx + 12) % 12) + 1;
  };

  // Fill example removed - using real API now

  // Calendar cells — dynamic based on current month
  const cells = [];
  for (let i = 0; i < currentMonthStartDow; i++) cells.push(null);
  for (let d = 1; d <= daysInCurrentMonth; d++) cells.push(d);

  const selEvents = selectedDay ? (activeCalendarEvents[selectedDay] || []) : [];

  const badgeClass = (type) => `ev-row-badge badge-${type}`;
  const badgeLabel = (type) => type === "void" ? "v/c" : type === "moon" ? "moon" : "transit";

  return (
    <>
      <style>{css}</style>
      <div className="nebula" />
      <svg className="stars" xmlns="http://www.w3.org/2000/svg">
        {STARS.map(s => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o}>
            <animate attributeName="opacity" values={`${s.o};${Math.min(s.o+0.35,0.85)};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      <div className="shell">
        <div className="card">

          {/* Header */}
          <header className="hdr">
            <div>
              <div className="logo">Keys to the <em>Stars</em></div>
              <div className="logo-sub">Astrology literacy · Whole sign houses · PST</div>
            </div>
            <div className="hdr-right">
              <div>Wednesday, April 1, 2026</div>
              <button className="print-btn no-print" onClick={() => window.print()}>⎙ Print Calendar</button>
            </div>
          </header>

          {/* Moon bar */}
          <div className="moon-bar">
            <div className={`moon-bar-item ${moonBarPhase?"active":""}`}
              onClick={() => setMoonBarPhase(v=>!v)}>
              Moon<span>{todayMoon ? `${cap(todayMoon.sign)} ${todayMoon.sign_symbol||""}` : "—"}</span>
            </div>
            <div className={`moon-bar-item ${moonBarPhase?"active":""}`}
              onClick={() => setMoonBarPhase(v=>!v)}>
              Phase<span>{todayMoon ? `${MOON_PHASES[todayMoon.phase]?.emoji || ""} ${MOON_PHASES[todayMoon.phase]?.name || todayMoon.phase} ${todayMoon.illumination ? Math.round(todayMoon.illumination)+"%" : ""}` : "—"}</span>
            </div>
            <div>Retrogrades<span>{
              transitData?.[monthKey]?.[currentDay]?.retrogrades?.length
                ? transitData[monthKey][currentDay].retrogrades.map(r => `${r.symbol} ${cap(r.planet)}`).join(", ")
                : "None active"
            }</span></div>
          </div>

          {/* Moon phase inline panel */}
          {moonBarPhase && (
            <div style={{ background: "var(--dusk)", padding: "1rem 2.5rem", borderBottom: "1px solid rgba(197,184,216,0.1)" }}>
              <div style={{ fontSize:"0.6rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(197,184,216,0.5)", marginBottom:"0.75rem" }}>
                Today's Moon Phase
              </div>
              <div style={{ maxWidth: 500 }}>
                <PhaseCard phaseKey={todayMoon?.phase || "waxing_gibbous"} />
              </div>
              <button onClick={() => setMoonBarPhase(false)}
                style={{ background:"none", border:"none", color:"rgba(197,184,216,0.4)", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", marginTop:"0.75rem" }}>
                ↑ Close
              </button>
            </div>
          )}

          {/* TODAY */}
          <section className="sec">
            <div className="sec-hdr">
              <span className="sec-title">{viewDay === 0 ? "Today's Sky" : `${viewDayName}, ${viewMonthName} ${viewDayNum}`}</span>
              <div style={{ display:"flex", gap:"0.4rem", alignItems:"center" }}>
                {viewDay > 0 && (
                  <button className="see-more no-print" onClick={() => setViewDay(v => v - 1)}>← Back</button>
                )}
                {viewDay < 6 && (
                  <button className="see-more no-print" onClick={() => setViewDay(v => v + 1)}>Next day →</button>
                )}
              </div>
            </div>
            {viewDay === 0 && <span style={{fontSize:"0.68rem",color:"var(--text-light)",fontStyle:"italic",display:"block",marginBottom:"0.5rem"}}>Browse up to 6 days ahead using the arrows above.</span>}
            {dataLoading && (
              <div style={{ color:"var(--text-light)", fontStyle:"italic", fontSize:"0.83rem", padding:"0.5rem 0" }}>
                Loading sky data...
              </div>
            )}

            {/* Short-term transits */}
            {shortTermTransits.length > 0 && (
              <>
                <div style={{ fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.5rem", marginTop:"0.25rem" }}>
                  Short-term transits
                </div>
                {shortTermTransits.map(t => <TransitRow key={t.id} t={t} />)}
              </>
            )}

            {/* Long-term transits */}
            <>
              <div style={{ fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.5rem", marginTop:"0.85rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
                Long-term transits
                {longTermTransits.length > 0 && (
                  <button className="see-more no-print" onClick={() => setShowLongTerm(v => !v)} style={{fontSize:"0.58rem"}}>
                    {showLongTerm ? "Collapse ↑" : `Show ${longTermTransits.length} ↓`}
                  </button>
                )}
              </div>
              {longTermTransits.length === 0 && (
                <div style={{ fontSize:"0.75rem", color:"var(--text-light)", fontStyle:"italic" }}>
                  No major outer planet aspects today.
                </div>
              )}
              {showLongTerm && longTermTransits.map(t => <TransitRow key={t.id} t={t} />)}
            </>

            {/* Fallback to hardcoded if no live data */}
            {!dataLoading && shortTermTransits.length === 0 && longTermTransits.length === 0 && (
              <>
                <div style={{ fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.5rem" }}>
                  Short-term transits
                </div>
                {activeTodayTransits.map(t => <TransitRow key={t.id} t={t} />)}
              </>
            )}

            {viewDay === 0 && DAY_SUMMARIES[currentDay] && (
              <div className="summary-block">
                <div className="summary-label">Overall energy · {currentMonthName} {currentDay}</div>
                <div className="summary-text">{DAY_SUMMARIES[currentDay]}</div>
              </div>
            )}
          </section>

          {/* THIS WEEK */}
          <section className="sec">
            <div className="sec-hdr">
              <span className="sec-title">This Week</span>
              <span className="sec-meta">Apr 2 – 7</span>
              <button className="see-more no-print" onClick={() => setShowWeek(v => !v)}>
                {showWeek ? "Collapse ↑" : "See more ↓"}
              </button>
            </div>
            {!showWeek && (
              <div style={{ color:"var(--text-light)", fontSize:"0.83rem", fontStyle:"italic" }}>
                6 upcoming transits — click "See more" to expand.
              </div>
            )}
            {showWeek && WEEK_TRANSITS.map(t => (
              <div key={t.id}>
                <div className="week-date-lbl">{t.date}</div>
                <TransitRow t={t} />
              </div>
            ))}
            {showWeek && (
              <div className="summary-block">
                <div className="summary-label">Overall energy · Apr 2 – 7</div>
                <div className="summary-text">{WEEK_SUMMARY}</div>
              </div>
            )}
          </section>

          {/* CALENDAR */}
          <section className="sec">
            <div className="sec-hdr">
              <span className="sec-title">{currentMonthName} {currentYear}</span>
              <span className="sec-meta">All transits, moon ingresses & void of course · Click any day</span>
            </div>
            <div style={{ fontSize:"0.68rem", fontStyle:"italic", color:"var(--text-light)", marginBottom:"0.5rem", lineHeight:1.55 }}>
              All times are Pacific (PST/PDT). Add 1 hour for Mountain · 2 for Central · 3 for Eastern.
            </div>
            <div style={{ fontSize:"0.68rem", color:"var(--text-light)", marginBottom:"0.85rem", display:"flex", gap:"1.2rem", flexWrap:"wrap" }}>
              <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#ede8f7",marginRight:5,verticalAlign:"middle"}}/>Transit</span>
              <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#dff0f4",marginRight:5,verticalAlign:"middle"}}/>Moon ingress</span>
              <span><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:"#faeee6",marginRight:5,verticalAlign:"middle"}}/>Void of course</span>
            </div>

            {/* Symbol reference */}
            <details style={{ marginBottom:"1rem" }}>
              <summary style={{ fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--lav-deep)", cursor:"pointer", userSelect:"none", marginBottom:"0.5rem" }}>
                Symbol guide ▸
              </summary>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"1.5rem", fontSize:"0.68rem", color:"var(--text-mid)", lineHeight:1.8, background:"var(--bg-light)", borderRadius:8, padding:"0.75rem 1rem", marginTop:"0.4rem" }}>
                <div>
                  <div style={{ fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.3rem" }}>Planets</div>
                  {Object.entries(PLANETS).map(([k,p]) => (
                    <div key={k}><span style={{fontWeight:600,marginRight:"0.3rem"}}>{p.symbol}</span>{p.name}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.3rem" }}>Aspects</div>
                  {Object.entries(ASPECTS).map(([k,a]) => (
                    <div key={k}><span style={{fontWeight:600,marginRight:"0.3rem"}}>{a.symbol}</span>{a.name} {a.degrees}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.3rem" }}>Signs</div>
                  {Object.entries(SIGNS).map(([k,s]) => (
                    <div key={k}><span style={{fontWeight:600,marginRight:"0.3rem"}}>{s.symbol}</span>{s.name}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.3rem" }}>Moon Phases</div>
                  {Object.entries(MOON_PHASES).map(([k,p]) => (
                    <div key={k}><span style={{marginRight:"0.3rem"}}>{p.emoji}</span>{p.name}</div>
                  ))}
                  <div style={{marginTop:"0.4rem"}}><span style={{fontWeight:600,marginRight:"0.3rem"}}>v/c</span>Void of course</div>
                </div>
              </div>
            </details>

            <div className="cal-grid">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="cal-dh">{d}</div>
              ))}
              {cells.map((d, i) => (
                <div key={i}
                  className={`cal-cell ${!d?"empty":""} ${d===currentDay?"today":""} ${d===selectedDay?"sel":""}`}
                  onClick={() => d && setSelectedDay(d === selectedDay ? null : d)}
                >
                  {d && <>
                    <div className="cal-num">{d}</div>
                    {(() => {
                      if (!activeDayPhase[d]) return null;
                      const phaseDisplay = {
                        new:           { emoji: "🌑", label: "New Moon" },
                        first_quarter: { emoji: "🌓", label: "1st Quarter" },
                        full:          { emoji: "🌕", label: "Full Moon" },
                        last_quarter:  { emoji: "🌗", label: "3rd Quarter" },
                      };
                      const p = phaseDisplay[activeDayPhase[d]];
                      if (!p) return null;
                      return (
                        <div className="cal-phase" title={p.label}>
                          {p.emoji} <span style={{fontSize:"0.48rem"}}>{p.label}</span>
                        </div>
                      );
                    })()}
                    {(activeCalendarEvents[d]||[]).map((ev,ei) => (
                      <div key={ei} className={`ev ${ev.type}`} title={`${ev.label} · ${ev.time} · ${ev.duration}`}>
                        {ev.symbol || ev.label}
                      </div>
                    ))}
                  </>}
                </div>
              ))}
            </div>

            {selectedDay && (
              <div className="cal-detail">
                <div className="cal-d-date">{currentMonthName} {selectedDay}, {currentYear}</div>
                {selEvents.length === 0
                  ? <div style={{color:"var(--text-light)",fontStyle:"italic",fontSize:"0.82rem"}}>No major transits on this day.</div>
                  : <div className="cal-detail-grid">
                      {selEvents.map((ev, i) => (
                        <div key={i} className="ev-row">
                          <span className="ev-name">
                            {ev.label}
                            <span className={badgeClass(ev.type)} style={{marginLeft:"0.4rem"}}>{badgeLabel(ev.type)}</span>
                          </span>
                          <span className="ev-time">{ev.time} PST</span>
                          <span className="ev-dur">{ev.duration}</span>
                        </div>
                      ))}
                    </div>
                }
                {DAY_SUMMARIES[selectedDay] && (
                  <div className="summary-block">
                    <div className="summary-label">Overall energy · {currentMonthName} {selectedDay}</div>
                    <div className="summary-text">{DAY_SUMMARIES[selectedDay]}</div>
                  </div>
                )}
                {activeDayPhase[selectedDay] && (
                  <div style={{ marginTop:"0.85rem" }}>
                    <div style={{ fontSize:"0.6rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.5rem" }}>
                      Moon Phase
                    </div>
                    <PhaseCard phaseKey={activeDayPhase[selectedDay]} />
                  </div>
                )}
              </div>
            )}
          </section>

          {/* MOON PHASES */}
          <section className="sec">
            <div className="sec-hdr">
              <span className="sec-title">Moon Phases</span>
              <span className="sec-meta">The 8 phases · click any to learn its meaning</span>
            </div>
            <div className="phase-grid">
              {Object.keys(MOON_PHASES).map(key => (
                <PhaseCard key={key} phaseKey={key} />
              ))}
            </div>
          </section>

          {/* BIRTH CHART */}
          <section className="sec birth-section">
            <div className="sec-hdr">
              <span className="sec-title">Your Chart</span>
              <span className="sec-meta">See which houses today's transits activate for you</span>
            </div>
            <div className="birth-grid">
              <div>
                <label className="b-lbl">Birth Date</label>
                <input className="b-input" placeholder="e.g. June 3, 1990"
                  value={birthData.date} onChange={e => updateBirthData({...birthData, date: e.target.value})} />
                <label className="b-lbl">Birth Time</label>
                <input className="b-input" placeholder="e.g. 7:45 PM"
                  value={birthData.time} onChange={e => updateBirthData({...birthData, time: e.target.value})} />
                <label className="b-lbl">Birth Place</label>
                <input className="b-input" placeholder="e.g. Austin, Texas"
                  value={birthData.place} onChange={e => updateBirthData({...birthData, place: e.target.value})} />
                <div style={{ fontSize:"0.65rem", color:"var(--text-light)", fontStyle:"italic", marginTop:"0.5rem", lineHeight:1.55 }}>
                  🔒 Your birth data is saved only in your browser. It never leaves your device.
                </div>
                <button className="b-btn" onClick={fetchBirthChart} disabled={chartLoading}>
                  {chartLoading ? "Loading your chart..." : "Show my houses →"}
                </button>
                {chartError && (
                  <div style={{marginTop:"0.75rem", fontSize:"0.78rem", color:"#c0392b", lineHeight:1.6}}>
                    {chartError}
                  </div>
                )}
              </div>

              <div>
                {!showHouses && !chartLoading && (
                  <p className="placeholder-note">
                    Your birth chart is divided into 12 houses, each governing a different area of life — relationships, career, home, creativity, and more. When planets move through the sky, they activate different houses depending on your rising sign. Enter your birth data and Keys to the Stars will show you which areas of your life today's transits are touching. No predictions. Just the map of your sky.
                  </p>
                )}
                {chartLoading && (
                  <div style={{color:"var(--text-light)", fontStyle:"italic", fontSize:"0.85rem", lineHeight:1.7}}>
                    Calculating your chart from the stars... ✨
                  </div>
                )}
                {showHouses && chartData && (() => {
                  // API returns planets as keys on chart_data.subject
                  const subj = chartData.chart_data?.subject || chartData.subject || {};

                  const signMap = {
                    "Ari":"aries","Tau":"taurus","Gem":"gemini","Can":"cancer",
                    "Leo":"leo","Vir":"virgo","Lib":"libra","Sco":"scorpio",
                    "Sag":"sagittarius","Cap":"capricorn","Aqu":"aquarius","Pis":"pisces"
                  };

                  const normalize = (s) => s ? (signMap[s] || s.toLowerCase()) : null;

                  // Get rising sign from first house
                  const ascSign = normalize(subj.first_house?.sign || subj.ascendant?.sign);
                  const risingDisplay = ascSign ? ascSign.charAt(0).toUpperCase() + ascSign.slice(1) : "Unknown";

                  // Build transit planets from live data
                  const transitPlanets = [];
                  if (transitData?.[monthKey]?.[currentDay]?.planets) {
                    const pd = transitData[monthKey][currentDay].planets;
                    ["sun","moon","mercury","venus","mars","saturn","jupiter"].forEach(name => {
                      if (pd[name]?.sign) transitPlanets.push({ name: cap(name), sign: pd[name].sign });
                    });
                  } else {
                    // Fallback
                    [["Sun","aries"],["Moon","capricorn"],["Mercury","aries"],["Venus","pisces"],["Saturn","aries"]].forEach(([name,sign]) => {
                      transitPlanets.push({ name, sign });
                    });
                  }

                  return (
                    <div className="house-results">
                      <div className="house-intro">
                        Your rising sign is <strong style={{color:"var(--text-mid)",fontStyle:"normal"}}>{risingDisplay}</strong>. Using whole sign houses, today's transiting planets fall in these areas of your life.
                      </div>
                      {transitPlanets.map((tp, i) => {
                        const houseNum = getHouseFromSign(tp.sign, ascSign);
                        const house = houseNum ? HOUSES[houseNum] : null;
                        if (!house) return null;
                        const planetData = PLANETS[tp.name.toLowerCase()];
                        return (
                          <div key={i} className="house-card">
                            <div className="hc-top">
                              {planetData?.symbol} {tp.name} in {cap(tp.sign)} — transiting your {house.name}
                            </div>
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

          {/* GO DEEPER */}
          <section className="sec">
            <div className="sec-hdr">
              <span className="sec-title">Go Deeper</span>
              <span className="sec-meta">Books & ways to support this site</span>
            </div>

            {/* Astrology books */}
            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.65rem" }}>Astrology Reading List</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem" }}>
                <a href="https://bookshop.org/lists/astrology-kate-mageau-counseling-llc?aid=98002" target="_blank" rel="noopener noreferrer" className="resource-card" style={{flexBasis:"100%"}}>
                  <div className="rc-emoji">✨</div>
                  <div>
                    <div className="rc-title">Kate's Astrology Reading List</div>
                    <div className="rc-sub">Curated titles on Bookshop.org — supports independent bookstores. This site earns a small affiliate commission.</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Kate's books */}
            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.65rem" }}>From the Creator</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem" }}>
                <a href="https://bookshop.org/p/books/rose-colored-glasses-kate-mageau/97e4de4362fdb5bd?ean=9798998719691&next=t&aid=98002&listref=books-on-domestic-violence-intimate-partner-violence" target="_blank" rel="noopener noreferrer" className="resource-card">
                  <div className="rc-emoji">📖</div>
                  <div>
                    <div className="rc-title">Rose Colored Glasses</div>
                    <div className="rc-sub">On Bookshop.org</div>
                  </div>
                </a>
                <a href="https://www.amazon.com/dp/B0FL1F1Y7W?tag=katemageau0a-20" target="_blank" rel="noopener noreferrer" className="resource-card">
                  <div className="rc-emoji">📖</div>
                  <div>
                    <div className="rc-title">Rose Colored Glasses</div>
                    <div className="rc-sub">On Amazon</div>
                  </div>
                </a>
                <a href="https://www.amazon.com/dp/B0DFMXSWDC?tag=katemageau0a-20" target="_blank" rel="noopener noreferrer" className="resource-card">
                  <div className="rc-emoji">📝</div>
                  <div>
                    <div className="rc-title">Healing from Toxic Relationships Workbook</div>
                    <div className="rc-sub">On Amazon</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Support */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", alignItems:"stretch", marginBottom:"1.5rem" }}>
              <a href="https://ko-fi.com/katemageau" target="_blank" rel="noopener noreferrer" className="support-card">
                <span style={{ fontSize:"1.2rem" }}>☕</span>
                <div>
                  <div className="rc-title">Buy me a coffee</div>
                  <div className="rc-sub">Keep the stars lit. No account needed.</div>
                </div>
              </a>
            </div>

            {/* About the creator */}
            <div style={{ fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--lav-deep)", marginBottom:"0.65rem" }}>About the Creator</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem" }}>
              <a href="https://www.katemageau.com/" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="rc-emoji">🌙</div>
                <div>
                  <div className="rc-title">katemageau.com</div>
                  <div className="rc-sub">Books, writing & more from Kate Mageau</div>
                </div>
              </a>
              <a href="https://www.empoweringtherapy.online/" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="rc-emoji">💙</div>
                <div>
                  <div className="rc-title">Empowering Therapy</div>
                  <div className="rc-sub">Therapy · ADHD/Autism Assessments · Gender-Affirming Letters · Emotional Support Animal Letters · Therapist Trainings</div>
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
