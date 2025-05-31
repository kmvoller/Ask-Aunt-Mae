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

    try {
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
          system: "You are Aunt Mae, a patient advocacy expert.",
          messages: [{ role: 'user', content: message }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(200).json({ 
          response: `Claude API failed with status ${response.status}: ${errorText}` 
        });
      }

      const data = await response.json();
      return res.status(200).json({ response: data.content[0].text });

    } catch (fetchError) {
      return res.status(200).json({ 
        response: `Fetch error: ${fetchError.message}` 
      });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
