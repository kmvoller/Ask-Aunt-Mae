export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.aunt_mae;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: "You are Aunt Mae, a patient advocacy expert with deep healthcare systems knowledge. Your role is to provide warm, practical guidance to help people navigate healthcare challenges. Be empathetic but never provide medical advice.",
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json({ response: data.content[0].text });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Error calling Claude API',
      details: error.message 
    });
  }
}
