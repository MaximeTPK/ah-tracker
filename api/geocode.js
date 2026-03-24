export default async function handler(req, res) {
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({ error: 'Missing address parameter' });
  }

  const API_KEY = process.env.GOOGLE_GEOCODE_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results[0]) {
      const loc = data.results[0].geometry.location;
      return res.status(200).json({ lat: loc.lat, lng: loc.lng });
    }

    return res.status(200).json({ lat: null, lng: null });
  } catch (e) {
    return res.status(500).json({ error: 'Geocoding failed' });
  }
}
