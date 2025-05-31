export default function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.aunt_mae;
    
    // Test environment variable
    if (!apiKey) {
      return res.status(200).json({ 
        response: 'Environment variable not found. Need to check Vercel settings.' 
      });
    }

    return res.status(200).json({ 
      response: `Environment variable works! Got your message: "${message}". API key is ${apiKey.length} characters long.` 
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
