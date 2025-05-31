export default function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(200).json({ 
      response: 'Basic test works! Your API is functioning.' 
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
