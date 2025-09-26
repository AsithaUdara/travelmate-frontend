// controllers/plannerController.js
// Lightweight heuristic itinerary generator. Replace with AI later.

// Basic waypoint templates with coordinates in Sri Lanka
const WAYPOINTS = {
  Colombo: { lat: 6.9271, lng: 79.8612, title: 'Arrival & City Exploration' },
  Kandy: { lat: 7.2906, lng: 80.6337, title: 'Cultural Hub' },
  Ella: { lat: 6.8667, lng: 81.0466, title: 'Nature & Hiking' },
  Yala: { lat: 6.3667, lng: 81.4667, title: 'Wildlife Safari' },
  Mirissa: { lat: 5.9482, lng: 80.4548, title: 'Beaches & Departure' },
};

const pickWaypoint = (name) => {
  const wp = WAYPOINTS[name];
  if (!wp) return null;
  return { location: name, title: wp.title, latitude: wp.lat, longitude: wp.lng };
};

const generateItinerary = (start, end, interests) => {
  const base = [];
  // Always start in Colombo if start matches known or is empty default
  const startWP = pickWaypoint(start) || pickWaypoint('Colombo');
  if (startWP) base.push({ ...startWP, dateOffset: 0, duration: 2 });

  if (interests?.includes('Cultural Sites')) {
    const kandy = pickWaypoint('Kandy');
    if (kandy) base.push({ ...kandy, dateOffset: 2, duration: 2 });
  }
  if (interests?.includes('Hiking')) {
    const ella = pickWaypoint('Ella');
    if (ella) base.push({ ...ella, dateOffset: 4, duration: 2 });
  }
  if (interests?.includes('Wildlife')) {
    const yala = pickWaypoint('Yala');
    if (yala) base.push({ ...yala, dateOffset: 6, duration: 2 });
  }

  const endWP = pickWaypoint(end) || pickWaypoint('Mirissa');
  if (endWP) base.push({ ...endWP, dateOffset: 8, duration: 2 });

  base.sort((a, b) => a.dateOffset - b.dateOffset);

  const tripDays = [];
  let currentDay = 1;
  const startDate = new Date();

  for (const point of base) {
    for (let i = 0; i < point.duration; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + (point.dateOffset + i));
      tripDays.push({
        day: currentDay++,
        date: dayDate.toISOString().split('T')[0],
        location: point.location,
        title: i === 0 && point.duration > 1 ? point.title : `Exploring ${point.location}`,
        activities: [],
        latitude: point.latitude,
        longitude: point.longitude,
      });
    }
  }

  return tripDays;
};

exports.generateTrip = async (req, res) => {
  try {
    const { start, end, interests } = req.body || {};
    if (!start || !end || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ message: 'Missing required planning parameters.' });
    }

    const days = generateItinerary(start, end, interests);
    if (!days.length) {
      return res.status(500).json({ message: 'Failed to build itinerary.' });
    }

    const tripData = {
      id: `draft-${Date.now()}`,
      name: `${start} to ${end} Adventure`,
      startDate: days[0].date,
      endDate: days[days.length - 1].date,
      days,
    };

    res.status(200).json(tripData);
  } catch (err) {
    console.error('Error generating trip:', err);
    res.status(500).json({ message: 'Failed to generate trip outline.' });
  }
};
