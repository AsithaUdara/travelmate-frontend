const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- FUNCTION 1: Generate the master trip itinerary ---
exports.generateTrip = async (req, res) => {
  try {
    const { start, end, interests, startDate, endDate } = req.body;
    if (!start || !end || !interests || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required planning parameters.' });
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const duration = Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    const prompt = `
      You are an expert Sri Lankan travel planner and route optimization specialist, acting as a JSON API.
      Your task is to create the most **geographically logical and efficient road trip itinerary** for a ${duration}-day trip in Sri Lanka.
      The user's request is:
      - Start Location: ${start}
      - Must-Visit Destination: ${end}
      - Main Interests: ${interests.join(', ')}
      
      Instructions:
      1.  Create a touring route that starts at ${start}, includes ${end}, and may include other locations from your knowledge that match the user's interests.
      2.  The path MUST be a sensible, efficient driving route across Sri Lanka. Avoid unnecessary backtracking. For example, a correct route is Colombo -> Kandy -> Ella -> Yala -> Mirissa. An incorrect, inefficient route is Colombo -> Ella -> Kandy -> Yala.
      3.  For each stop, provide its accurate latitude and longitude.
      4.  Allocate a logical number of days to each location.
      
      The output must be a single, minified JSON object with no markdown formatting, structured as: { "name": string, "days": [{ "day": number, "date": string, "location": string, "title": string, "latitude": number, "longitude": number }] }.
      - Dates must be sequential starting from ${startDate}.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      let tripData;
      try {
        tripData = JSON.parse(text);
      } catch (e) {
        tripData = null;
      }
      if (!tripData || !Array.isArray(tripData.days) || tripData.days.length === 0) {
        const fb = buildSriLankaTripFallback(start, end, interests, startDate, endDate);
        return res.status(200).json(fb);
      }
      const finalTrip = { ...tripData, id: `ai-${Date.now()}`, startDate, endDate, days: (tripData.days || []).map(day => ({ ...day, activities: [] })) };
      return res.status(200).json(finalTrip);
    } catch (e) {
      // Gemini failure (quota/key/network). Return heuristic fallback instead of 500 so UI can proceed.
      const fb = buildSriLankaTripFallback(start, end, interests, startDate, endDate);
      return res.status(200).json(fb);
    }

  } catch (error) {
    console.error("Error in generateTrip:", error);
    try {
      const { start, end, interests, startDate, endDate } = req.body || {};
      const fb = buildSriLankaTripFallback(start, end, interests, startDate, endDate);
      return res.status(200).json(fb);
    } catch (e) {
      return res.status(500).json({ message: "Failed to generate trip outline." });
    }
  }
};

// --- FUNCTION 2: Get dynamic AI suggestions for a specific location ---
exports.getSuggestions = async (req, res) => {
  try {
    const { location, interests } = req.body;
    if (!location || !interests) {
      return res.status(400).json({ message: 'Location and interests are required.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a local Sri Lankan tour guide acting as a JSON API.
      A tourist visiting "${location}" is interested in ${Array.isArray(interests) ? interests.join(', ') : interests}.
      
      List 3-4 specific, relevant, and popular activity suggestions for them in or very near "${location}".
      
      The output must be a single, minified JSON array with no markdown formatting.
      Each object in the array must strictly follow this structure: { "id": string, "name": string, "type": string, "duration": number, "cost": number }.
      - "id" must be a unique string like "sug-1", "sug-2", etc.
    `;

    let suggestions = [];
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        suggestions = JSON.parse(text);
      } catch (e) {
        suggestions = [];
      }
    } catch (e) {
      suggestions = [];
    }
    // Validate shape for activities; otherwise use activity fallback
    const validArray = Array.isArray(suggestions) && suggestions.length > 0;
    const looksValid = validArray && suggestions.every(o => o && typeof o === 'object' && typeof o.id === 'string' && typeof o.name === 'string' && typeof o.type === 'string' && typeof o.duration === 'number' && typeof o.cost === 'number');
    if (!looksValid) {
      const fallback = buildActivityFallback(location, interests);
      return res.status(200).json(fallback);
    }
    return res.status(200).json(suggestions);

  } catch (error) {
    console.error("Error in getSuggestions:", error);
    try {
      const { location, interests } = req.body || {};
      const fb = buildActivityFallback(location || 'Sri Lanka', interests || []);
      return res.status(200).json(fb);
    } catch (e) {
      return res.status(500).json({ message: "Failed to get suggestions." });
    }
  }
};

// --- FUNCTION 3: Get dynamic AI transport suggestions for a travel leg ---
exports.getTransportOptions = async (req, res) => {
  try {
    const { from, to, interests } = req.body;
    if (!from || !to || !interests) {
      return res.status(400).json({ message: 'From, to, and interests are required.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
            You are a seasoned Sri Lankan travel logistics expert, acting as a JSON API. You have deep knowledge of real, existing transport infrastructure in Sri Lanka.
            A tourist needs to travel from "${from}" to "${to}".
            Their interests are: ${Array.isArray(interests) ? interests.join(', ') : interests}.

            Your task is to provide 2–3 realistic and practical transport options for this specific journey.

            CRITICAL RULES:
            1) Only suggest transport modes that actually exist or are realistically usable between these locations. If there's no practical rail journey, DO NOT suggest a train.
            2) For trains, use a real service/line name when applicable, and NEVER suggest hill-country scenic trains (e.g., "Udarata Menike") unless the corridor is in the Kandy–Nuwara Eliya–Ella–Badulla line.
            3) For buses, specify type (e.g., "Highway Express Bus", "Local Bus"), and note transfers if needed.
            4) For private hire, use names like "Private Car / Van" with realistic time and cost.
            5) Provide realistic estimates for time (hours) and cost (LKR).
            6) Based on the user's interests, choose exactly ONE option as isRecommended=true.

            Output a single, minified JSON array (no markdown). Each object must be:
            { "id": string, "category": "Train" | "Bus" | "Private Hire", "name": string, "provider": string, "time": number, "cost": number, "comfort": number, "isRecommended": boolean, "details": string }.
            Only ONE object may have isRecommended=true.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    let transportOptions = [];
    try {
      transportOptions = JSON.parse(text);
    } catch (e) {
      transportOptions = [];
    }
    // Post-validate and correct to enforce realism
    const corrected = enforceTransportRealism(from, to, interests, Array.isArray(transportOptions) ? transportOptions : []);
    if (!corrected || corrected.length === 0) {
      // fall back to heuristic if AI returned nothing usable
      const fb = buildSriLankaTransportFallback(from, to, interests);
      return res.status(200).json(fb);
    }
    return res.status(200).json(corrected);
  } catch (error) {
    console.error("Error in getTransportOptions:", error);
    // Graceful fallback on any error (rate limit, missing key, parse error, etc.)
    try {
      const { from, to, interests } = req.body;
      const fallback = buildSriLankaTransportFallback(from, to, interests);
      return res.status(200).json(fallback);
    } catch (e) {
      console.error('Fallback generation failed:', e);
      res.status(500).json({ message: "Failed to get transport options." });
    }
  }
};

// --- Enforcement: sanitize and constrain AI transport output ---
function enforceTransportRealism(from, to, interests, opts) {
  const key = `${normalize(from)}-${normalize(to)}`;
  const northRoute = /jaffna|anuradhapura|kilinochchi|vavuniya|mannar/i.test(key);
  const hillRoute = /kandy|nuwara|nanu\s*oya|ella|badulla|haputale|peradeniya/i.test(key);
  const coastalSouth = /galle|mirissa|matara|hikkaduwa|weligama/i.test(key);

  let list = (opts || []).filter(o => o && typeof o === 'object');

  // Remove train for clearly non-train legs per user expectation (e.g., Minneriya→Jaffna) and for generic non-corridors
  if (northRoute || /minneriya/i.test(key)) {
    list = list.filter(o => (o.category || '').toLowerCase() !== 'train');
  } else {
    const trainAllowed = hillRoute || coastalSouth || /colombo/i.test(key);
    if (!trainAllowed) list = list.filter(o => (o.category || '').toLowerCase() !== 'train');
  }

  // Strip scenic train names/details if not on hill route
  if (!hillRoute) {
    list = list.filter(o => !/udarata|ella|scenic/i.test(`${o.name || ''} ${o.details || ''}`));
  }

  // Normalize categories and fields
  list = list.map((o) => {
    let category = String(o.category || '').trim();
    const blob = `${o.category || ''} ${o.name || ''} ${o.details || ''}`.toLowerCase();
    if (!['Train', 'Bus', 'Private Hire'].includes(category)) {
      if (/bus/.test(blob)) category = 'Bus';
      else if (/train|rail/.test(blob)) category = 'Train';
      else category = 'Private Hire';
    }
    let name = o.name || (category === 'Bus' ? 'Intercity/Local Bus' : category === 'Train' ? 'Express Service' : 'Private Car / Van');
    if (!hillRoute && /udarata\s*menike/i.test(name)) {
      name = name.replace(/Udarata\s*Menike/ig, 'Intercity Train');
    }
    const time = typeof o.time === 'number' ? o.time : Number(o.time) || (category === 'Bus' ? 6 : category === 'Train' ? 5 : 4);
    const cost = typeof o.cost === 'number' ? o.cost : Number(o.cost) || (category === 'Bus' ? 900 : category === 'Train' ? 2000 : 15000);
    const comfort = [1,2,3,4,5].includes(o.comfort) ? o.comfort : (category === 'Private Hire' ? 5 : category === 'Train' ? 3 : 2);
    const provider = o.provider || (category === 'Bus' ? 'SLTB/Private' : category === 'Train' ? 'Sri Lanka Railways' : 'Local Hirers');
    const details = o.details || (category === 'Bus' ? 'Intercity/Local bus service with transfers as needed.' : category === 'Train' ? 'Express service where available.' : 'Door-to-door ride with luggage space.');
    return { id: o.id || `${category.slice(0,1).toLowerCase()}-${Math.random().toString(36).slice(2,8)}`, category, name, provider, time, cost, comfort, isRecommended: !!o.isRecommended, details };
  });

  // Ensure exactly one recommended
  let recIndex = list.findIndex(o => o.isRecommended === true);
  if (recIndex === -1) {
    const scenicInterests = toArray(interests).some(i => /hiking|nature|photography|scenic|wildlife/i.test(i));
    const comfortInterests = toArray(interests).some(i => /comfort|luxury|family|kids/i.test(i));
    let pick = 0;
    if (comfortInterests) {
      const i = list.findIndex(o => o.category === 'Private Hire');
      if (i >= 0) pick = i;
    } else if (scenicInterests && hillRoute) {
      const i = list.findIndex(o => o.category === 'Train');
      if (i >= 0) pick = i;
    } else {
      const i = list.findIndex(o => o.category === 'Bus');
      if (i >= 0) pick = i;
    }
    list = list.map((o, i) => ({ ...o, isRecommended: i === pick }));
  } else {
    list = list.map((o, i) => ({ ...o, isRecommended: i === recIndex }));
  }

  // Ensure 2–3 options
  if (list.length < 2) {
    if (!list.some(o => o.category === 'Bus')) list.push(opt('Bus', 'Intercity/Local Bus', 'SLTB/Private', 6, 900, 2, 'Budget route with possible transfers.'));
    if (!list.some(o => o.category === 'Private Hire')) list.push(opt('Private Hire', 'Private Car / Van', 'Local Hirers', 4.5, 16000, 5, 'Door-to-door convenience.'));
  }
  if (list.length > 3) {
    list = list.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0) || b.comfort - a.comfort).slice(0, 3);
  }
  return list;
}

// --- Local heuristic fallback when AI quota is exceeded ---
function buildSriLankaTransportFallback(from, to, interests) {
  const key = `${normalize(from)}-${normalize(to)}`;
  const scenicInterests = toArray(interests).some((i) => /hiking|nature|photography|scenic|wildlife/i.test(i));
  const comfortInterests = toArray(interests).some((i) => /comfort|luxury|family|kids/i.test(i));

  const optionsByLeg = {
    'colombo-kandy': [
      opt('Train', 'Intercity Express', 'Sri Lanka Railways', 2.5, 3000, 4, 'Fast, comfortable A/C train to the hill country.'),
      opt('Bus', 'Highway Express Bus', 'NTC', 3, 1200, 3, 'Frequent A/C buses via highway; great value.'),
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 3.5, 12000, 5, 'Door-to-door comfort with luggage space.'),
    ],
    'kandy-ella': [
      opt('Train', "Udarata Menike Scenic", 'Sri Lanka Railways', 6.5, 3000, 3, 'Iconic scenic ride through tea country; must-do for views.'),
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 4, 15000, 5, 'Fastest and most comfortable route, door-to-door.'),
      opt('Bus', 'Local/Intercity Bus', 'SLTB/Private', 6, 1000, 2, 'Budget option; limited comfort and stops en route.'),
    ],
    'ella-yala national park': [
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 4, 8000, 5, 'Most direct route into the Yala region with gear.'),
      opt('Bus', 'Local Bus (with transfer)', 'SLTB', 6, 600, 1, 'Cheapest but slower; likely requires transfer in Tissamaharama.'),
    ],
    // Common shorthand used in itineraries
    'ella-yala': [
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 4, 8000, 5, 'Most direct route into the Yala region with gear.'),
      opt('Bus', 'Local Bus (with transfer)', 'SLTB', 6, 600, 1, 'Cheapest but slower; likely requires transfer in Tissamaharama.'),
    ],
    'yala national park-mirissa': [
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 3, 6000, 5, 'Direct coastal route; flexible stops for views.'),
      opt('Bus', 'Coastal Bus', 'SLTB/Private', 4.5, 700, 2, 'Budget-friendly; may be crowded and multiple stops.'),
    ],
    'yala-mirissa': [
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 3, 6000, 5, 'Direct coastal route; flexible stops for views.'),
      opt('Bus', 'Coastal Bus', 'SLTB/Private', 4.5, 700, 2, 'Budget-friendly; may be crowded and multiple stops.'),
    ],
    'mirissa-galle': [
      opt('Train', 'Coastal Line (2nd Class)', 'Sri Lanka Railways', 1.2, 500, 3, 'Short coastal hop with sea views.'),
      opt('Bus', 'Coastal Bus', 'SLTB/Private', 1.5, 300, 2, 'Very frequent, cheapest option.'),
      opt('Private Hire', 'Tuk-tuk / Car', 'Local Hirers', 1.2, 4000, 4, 'Flexible door-to-door stop for beaches.'),
    ],
    'galle-colombo': [
      opt('Train', 'Coastal Line (Express)', 'Sri Lanka Railways', 2.2, 700, 3, 'Sea-side route; popular and scenic.'),
      opt('Bus', 'Highway Express Bus', 'NTC', 2, 1200, 3, 'Fast via Southern Expressway; frequent A/C coaches.'),
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 2, 15000, 5, 'Most comfortable, ideal for airport transfers.'),
    ],
    'minneriya national park-jaffna': [
      opt('Bus', 'Intercity/Local Bus (with transfer)', 'SLTB/Private', 8, 1400, 2, 'Budget route via Anuradhapura/Vavuniya with transfers; no direct scenic train.'),
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 6.5, 22000, 5, 'Door-to-door across the north; fastest and most convenient.'),
    ],
  };

  // Try direct match first; otherwise make a generic reasonable set
  let options = optionsByLeg[key];
  if (!options) {
    // Fuzzy find by token subset (handles "yala" vs "yala national park", etc.)
    const keys = Object.keys(optionsByLeg);
    const [fromTokens, toTokens] = [tokenize(from), tokenize(to)];
    const matchKey = keys.find(k => {
      const [kf, kt] = k.split('-');
      return isTokenSubset(fromTokens, tokenize(kf)) && isTokenSubset(toTokens, tokenize(kt));
    });
    if (matchKey) {
      options = optionsByLeg[matchKey];
    }
  }
  if (!options) {
    // Region-aware heuristic to avoid impossible train corridors (e.g., to Jaffna from Minneriya)
    const northRoute = /jaffna|anuradhapura|kilinochchi|vavuniya|mannar/i.test(key);
    const hillRoute = /kandy|nuwara|ella|badulla|haputale/i.test(key);
    const coastalSouth = /galle|mirissa|matara|hikkaduwa|weligama/i.test(key);

    const generic = [
      opt('Private Hire', 'Private Car / Van', 'Local Hirers', 3.5, 12000, 5, 'Door-to-door convenience and comfort.'),
      opt('Bus', 'Intercity/Local Bus', 'SLTB/Private', 4.5, 900, 2, 'Cheapest option; slower and multiple stops.'),
    ];
    // Only add a train option when the corridor plausibly has service users expect (colombo↔galle, kandy↔ella corridor)
    if (hillRoute) {
      generic.unshift(opt('Train', 'Hill Country Scenic Service', 'Sri Lanka Railways', 5.5, 2500, 3, 'Scenic service within the hill country corridor.'));
    } else if (coastalSouth) {
      generic.unshift(opt('Train', 'Coastal Line Express', 'Sri Lanka Railways', 3.2, 1200, 3, 'Coastal line with sea views along the southern coast.'));
    } else if (!northRoute && /colombo/i.test(key)) {
      generic.unshift(opt('Train', 'Intercity/Express Service', 'Sri Lanka Railways', 3.5, 2000, 3, 'Popular intercity service to/from Colombo.'));
    }
    options = generic;
  }

  // Determine recommended
  let recommendedIndex = 0;
  if (scenicInterests) {
    const idx = options.findIndex((o) => o.category === 'Train');
    if (idx >= 0) recommendedIndex = idx;
  } else if (comfortInterests) {
    const idx = options.findIndex((o) => o.category === 'Private Hire');
    if (idx >= 0) recommendedIndex = idx;
  } else {
    const idx = options.findIndex((o) => o.category === 'Bus');
    if (idx >= 0) recommendedIndex = idx;
  }
  return options.map((o, i) => ({ ...o, isRecommended: i === recommendedIndex }));
}

function normalize(s) {
  return String(s || '').trim().toLowerCase();
}

function tokenize(s) {
  return normalize(s)
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

function isTokenSubset(a, b) {
  // returns true if every token in a is included in b
  const setB = new Set(b);
  return a.every(t => setB.has(t));
}

function toArray(x) {
  if (Array.isArray(x)) return x;
  if (!x) return [];
  return [x];
}

function opt(category, name, provider, time, cost, comfort, details) {
  return {
    id: `${category.slice(0, 1).toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`,
    category,
    name,
    provider,
    time,
    cost,
    comfort,
    isRecommended: false,
    details,
  };
}

// --- Heuristic itinerary fallback when AI is unavailable ---
function buildSriLankaTripFallback(start, end, interests, startDate, endDate) {
  const s = normalize(start) || 'colombo';
  const e = normalize(end) || 'ella';
  const ints = toArray(interests).map(normalize);
  const preferWild = ints.some(i => /wild|yala|safari|nature/.test(i));
  const preferBeach = ints.some(i => /beach|coast|surf|sunset/.test(i));

  // Default route pattern: Colombo -> Kandy -> Ella -> (Yala?) -> Mirissa -> Galle -> Colombo
  let route = ['Colombo', 'Kandy', 'Ella'];
  if (preferWild) route.push('Yala National Park');
  if (preferBeach) route.push('Mirissa');
  route.push('Galle');
  if (!/colombo/i.test(e)) route.push('Colombo');

  // Ensure start/end placement
  route[0] = start || 'Colombo';
  route[route.length - 1] = end || route[route.length - 1];

  const coords = {
    Colombo: { lat: 6.9271, lng: 79.8612 },
    Kandy: { lat: 7.2906, lng: 80.6337 },
    Ella: { lat: 6.9934, lng: 81.055 },
    'Yala National Park': { lat: 6.3667, lng: 81.4667 },
    Mirissa: { lat: 5.9482, lng: 80.4548 },
    Galle: { lat: 6.0535, lng: 80.221 },
  };

  const startTime = new Date(startDate || new Date());
  const endTime = new Date(endDate || new Date(Date.now() + 3 * 86400000));
  const totalDays = Math.max(1, Math.round((endTime - startTime) / 86400000) + 1);

  // Distribute days across route
  const segments = Math.min(route.length, totalDays);
  const base = Math.floor(totalDays / segments);
  let rem = totalDays - base * segments;

  const days = [];
  let dayCounter = 1;
  let currentDate = new Date(startTime);
  for (let i = 0; i < segments; i++) {
    const loc = route[i];
    const stay = base + (rem > 0 ? 1 : 0);
    if (rem > 0) rem--;
    for (let d = 0; d < stay; d++) {
      const { lat, lng } = coords[loc] || coords['Colombo'];
      days.push({
        day: dayCounter,
        date: currentDate.toISOString().slice(0, 10),
        location: loc,
        title: `${loc} Day ${d + 1}`,
        latitude: lat,
        longitude: lng,
        activities: [],
      });
      dayCounter++;
      currentDate = new Date(currentDate.getTime() + 86400000);
    }
  }

  return { id: `fb-${Date.now()}`, name: `${start || 'Trip'} to ${end || ''}`.trim(), days };
}

// --- Heuristic activity suggestions when AI is unavailable ---
function buildActivityFallback(location, interests) {
  const loc = normalize(location);
  const ints = toArray(interests).map(normalize);
  const isCulture = ints.some(i => /culture|temple|history|heritage|museum/.test(i));
  const isFood = ints.some(i => /food|cuisine|street/.test(i));
  const isNature = ints.some(i => /hike|trail|park|garden|nature|wild/.test(i));
  const isBeach = ints.some(i => /beach|surf|sunset/.test(i));

  const catalog = {
    colombo: [
      { name: 'Gangaramaya Temple', type: 'Cultural', duration: 2, cost: 500 },
      { name: 'Galle Face Green Sunset Walk', type: 'Leisure', duration: 1.5, cost: 0 },
      { name: 'Pettah Market Food Crawl', type: 'Food', duration: 2, cost: 1500 },
      { name: 'National Museum of Colombo', type: 'Museum', duration: 2.5, cost: 1000 },
    ],
    kandy: [
      { name: 'Temple of the Tooth', type: 'Cultural', duration: 2, cost: 1500 },
      { name: 'Kandy Lake Loop', type: 'Leisure', duration: 1.5, cost: 0 },
      { name: 'Royal Botanical Gardens - Peradeniya', type: 'Nature', duration: 2.5, cost: 1500 },
      { name: 'Cultural Dance Show', type: 'Cultural', duration: 1, cost: 2000 },
    ],
    ella: [
      { name: 'Little Adam’s Peak Hike', type: 'Hike', duration: 3, cost: 0 },
      { name: 'Nine Arch Bridge Viewpoint', type: 'Scenic', duration: 1.5, cost: 0 },
      { name: 'Ravana Falls Stop', type: 'Nature', duration: 1, cost: 0 },
      { name: 'Ella Rock (Experienced)', type: 'Hike', duration: 4, cost: 0 },
    ],
    galle: [
      { name: 'Galle Fort Ramparts Walk', type: 'Cultural', duration: 2, cost: 0 },
      { name: 'Galle Lighthouse & Sunset', type: 'Scenic', duration: 1.5, cost: 0 },
      { name: 'Old Dutch Hospital Precinct', type: 'Leisure', duration: 1.5, cost: 0 },
    ],
    mirissa: [
      { name: 'Whale Watching (Seasonal)', type: 'Wildlife', duration: 4, cost: 10000 },
      { name: 'Secret Beach Chill', type: 'Beach', duration: 2, cost: 0 },
      { name: 'Parrot Rock Sunset', type: 'Scenic', duration: 1, cost: 0 },
    ],
    yala: [
      { name: 'Yala Jeep Safari (Block 1)', type: 'Wildlife', duration: 4, cost: 12000 },
      { name: 'Birdwatching Near Tissamaharama', type: 'Nature', duration: 2, cost: 0 },
    ],
  };

  // Choose a base list by fuzzy matching
  const pickKey = Object.keys(catalog).find(k => loc.includes(k) || k.includes(loc)) || 'colombo';
  let list = catalog[pickKey].slice();

  // Bias selection by interests
  if (isCulture) list = list.sort((a, b) => (b.type === 'Cultural' ? 1 : 0) - (a.type === 'Cultural' ? 1 : 0));
  if (isFood) list = list.sort((a, b) => (b.type === 'Food' ? 1 : 0) - (a.type === 'Food' ? 1 : 0));
  if (isNature) list = list.sort((a, b) => (b.type === 'Nature' || b.type === 'Hike' ? 1 : 0) - (a.type === 'Nature' || a.type === 'Hike' ? 1 : 0));
  if (isBeach) list = list.sort((a, b) => (b.type === 'Beach' ? 1 : 0) - (a.type === 'Beach' ? 1 : 0));

  return list.slice(0, 4).map((item, idx) => ({
    id: `sug-${idx + 1}`,
    name: item.name,
    type: item.type,
    duration: item.duration,
    cost: item.cost,
  }));
}

// --- FUNCTION 4: Get dynamic AI accommodation suggestions for a location ---
exports.getAccommodationSuggestions = async (req, res) => {
  try {
    const { location, interests } = req.body;
    if (!location || !interests) {
      return res.status(400).json({ message: 'Location and interests are required.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Sri Lankan hotel booking expert, acting as a JSON API. Accuracy of location is critical.
      A tourist is looking for hotels specifically in or immediately around "${location}, Sri Lanka".
      Their interests are: ${Array.isArray(interests) ? interests.join(', ') : interests}.

      CRITICAL RULES:
      1) Only return hotels that are physically located IN or VERY NEAR "${location}". Do NOT return hotels from other cities (e.g., Colombo) unless ${location} is Colombo.
      2) Provide realistic values for: price per night in LKR, rating (1.0–5.0), review count, and accurate latitude/longitude.
      3) Choose exactly ONE hotel as the recommended option based on the interests and set isRecommended=true; all others must be false.

      Return a single minified JSON array (no markdown). Each object must match:
      { "id": string, "name": string, "category": "stay", "type": string, "images": string[], "rating": number, "reviews": number, "price": number, "totalPrice": number, "priceType": "night", "latitude": number, "longitude": number, "isRecommended": boolean }
      - id must be a unique string like "stay-1"
      - totalPrice may be price * 1.9 (fees/multi-night simulation)
    `;

    let suggestions = [];
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      suggestions = JSON.parse(text);
    } catch (e) {
      suggestions = [];
    }

    // Normalize and validate
  const FIXED_IMG = 'https://images.unsplash.com/photo-n_IKQDCyrG0?auto=format&fit=crop&w=1200&q=80';
    const norm = Array.isArray(suggestions) ? suggestions.filter(Boolean).map((s, i) => {
      const price = Number(s.price) > 0 ? Math.round(Number(s.price)) : 15000 + i * 1000;
      const totalPrice = Number(s.totalPrice) > 0 ? Math.round(Number(s.totalPrice)) : Math.round(price * 1.9);
      const rating = Number(s.rating) > 0 ? Number(s.rating) : 4 + (i % 2) * 0.3;
      const reviews = Number(s.reviews) > 0 ? Math.round(Number(s.reviews)) : 200 + i * 50;
      const lat = Number(s.latitude) || 0;
      const lng = Number(s.longitude) || 0;
      return {
        id: String(s.id || `stay-${i + 1}`),
        name: String(s.name || `${location} Stay ${i + 1}`),
        category: 'stay',
        type: String(s.type || 'Hotel'),
        images: [FIXED_IMG, FIXED_IMG, FIXED_IMG],
        rating,
        reviews,
        price,
        totalPrice,
        priceType: 'night',
        latitude: lat,
        longitude: lng,
        isRecommended: !!s.isRecommended,
      };
    }) : [];

    // Ensure exactly one recommended
    if (norm.length > 0) {
      let idx = norm.findIndex(x => x.isRecommended);
      if (idx === -1) idx = 0;
      norm.forEach((x, i) => x.isRecommended = i === idx);
    }

    if (!Array.isArray(norm) || norm.length === 0) {
      const fb = buildAccommodationFallback(location, interests).map((p) => ({ ...p, images: [FIXED_IMG, FIXED_IMG, FIXED_IMG] }));
      return res.status(200).json(fb);
    }
    return res.status(200).json(norm);

  } catch (error) {
  console.error('Error in getAccommodationSuggestions:', error);
    // Fallback with fixed image to keep UI functional
    try {
      const { location, interests } = req.body || {};
  const fb = buildAccommodationFallback(location || 'Sri Lanka', interests || []).map((p) => ({ ...p, images: ['https://images.unsplash.com/photo-n_IKQDCyrG0?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-n_IKQDCyrG0?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-n_IKQDCyrG0?auto=format&fit=crop&w=1200&q=80'] }));
      return res.status(200).json(fb);
    } catch (e) {
      return res.status(500).json({ message: 'Failed to get accommodation suggestions.' });
    }
  }
};

function buildAccommodationFallback(location, interests) {
  const loc = normalize(location);
  const ints = toArray(interests).map(normalize);
  const isLuxury = ints.some(i => /luxury|comfort|honeymoon|spa|premium|5\s*star/.test(i));
  const isBeach = ints.some(i => /beach|surf|sea|coast|sunset/.test(i));
  const isWild = ints.some(i => /wildlife|safari|yala|nature/.test(i));

  const coords = {
    colombo: { lat: 6.9271, lng: 79.8612 },
    kandy: { lat: 7.2906, lng: 80.6337 },
    ella: { lat: 6.9934, lng: 81.0550 },
    galle: { lat: 6.0535, lng: 80.2210 },
    mirissa: { lat: 5.9482, lng: 80.4548 },
    'yala national park': { lat: 6.3667, lng: 81.4667 },
    yala: { lat: 6.3667, lng: 81.4667 },
  };

  function pickCoord(name) {
    const key = Object.keys(coords).find(k => name.includes(k));
    return key ? coords[key] : { lat: 7.2906, lng: 80.6337 };
  }

  // Curated catalog (local images so Next/Image doesn't need remote allowlist)
  const catalog = [
    {
      name: 'Galle Face Hotel', where: 'colombo', type: '5-Star Hotel', price: 125000, rating: 4.7, reviews: 6201,
      images: ['/gallery/gallery-1.jpg', '/hero/hero-1.jpg', '/hero/hero-2.jpg']
    },
    {
      name: 'Cinnamon Grand Colombo', where: 'colombo', type: 'City Hotel', price: 110000, rating: 4.6, reviews: 7800,
      images: ['/gallery/cta-bg.jpg', '/hero/hero-6.jpg']
    },
    {
      name: 'The Grand Kandyan', where: 'kandy', type: 'Luxury Hotel', price: 95000, rating: 4.6, reviews: 4102,
      images: ['/gallery/gallery-2.jpg', '/hero/hero-3.jpg']
    },
    {
      name: 'Jetwing Vil Uyana', where: 'sigiriya', type: 'Luxury Villa Resort', price: 180000, rating: 4.9, reviews: 2980,
      images: ['/gallery/gallery-4.jpg', '/hero/hero-5.jpg']
    },
    {
      name: '98 Acres Resort & Spa', where: 'ella', type: 'Resort', price: 98000, rating: 4.8, reviews: 3150,
      images: ['/gallery/gallery-3.jpg', '/hero/hero-4.jpg']
    },
    {
      name: 'The Fortress Resort & Spa', where: 'galle', type: 'Boutique Resort', price: 165000, rating: 4.8, reviews: 2400,
      images: ['/gallery/cta-bg2.jpg', '/hero/hero-2.jpg']
    },
    {
      name: 'Weligama Bay Marriott', where: 'mirissa', type: 'Beachfront Hotel', price: 145000, rating: 4.7, reviews: 3521,
      images: ['/hero/hero-6.jpg', '/gallery/gallery-2.jpg']
    },
    {
      name: 'Cinnamon Wild Yala', where: 'yala', type: 'Safari Lodge', price: 120000, rating: 4.6, reviews: 4210,
      images: ['/hero/hero-4.jpg', '/gallery/gallery-3.jpg']
    },
  ];

  // Narrow to location
  const base = catalog.filter(c => loc.includes(c.where) || c.where.includes(loc) || (
    loc.includes('yala') && c.where === 'yala'
  ) || (
    loc.includes('national park') && c.where === 'yala'
  ));
  let picks = base.length ? base : catalog;

  // If beach-focused, bias to coastal
  if (isBeach) {
    picks = picks.filter(p => /galle|mirissa|weligama/.test(p.where)) || picks;
  }
  // If wildlife-focused, bias to yala
  if (isWild) {
    picks = picks.filter(p => /yala/.test(p.where)).concat(picks.filter(p => !/yala/.test(p.where))).slice(0, Math.max(4, Math.min(5, picks.length)));
  }

  // Ensure we return 4-5 items
  const out = picks.slice(0, 5).map((p) => {
    const { lat, lng } = pickCoord(p.where);
    const price = p.price;
    return {
      id: `stay-${Math.random().toString(36).slice(2, 8)}`,
      name: p.name,
      category: 'stay',
      type: p.type,
      images: p.images,
      rating: p.rating,
      reviews: p.reviews,
      price,
      totalPrice: Math.round(price * 1.9),
      priceType: 'night',
      latitude: lat,
      longitude: lng,
      isRecommended: false,
    };
  });

  // Choose recommended
  let recIdx = 0;
  if (isLuxury) {
    let maxPrice = -1;
    out.forEach((o, i) => { if (o.price > maxPrice) { maxPrice = o.price; recIdx = i; } });
  } else if (isWild) {
    const i = out.findIndex(o => /yala|safari/i.test(o.type) || /yala/i.test(o.name));
    if (i >= 0) recIdx = i;
  } else if (isBeach) {
    const i = out.findIndex(o => /beach|resort|bay/i.test(o.type) || /galle|mirissa|weligama/i.test(o.name));
    if (i >= 0) recIdx = i;
  } else {
    // Highest rating
    let best = -1; let bi = 0;
    out.forEach((o, i) => { const score = o.rating * 10000 + o.reviews; if (score > best) { best = score; bi = i; } });
    recIdx = bi;
  }
  return out.map((o, i) => ({ ...o, isRecommended: i === recIdx }));
}
