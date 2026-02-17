import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the SMM API URL and key from server environment variables (not exposed to client)
  const SMM_API_URL = process.env.SMM_API_URL;
  const SMM_API_KEY = process.env.SMM_API_KEY;

  if (!SMM_API_URL || !SMM_API_KEY) {
    return res.status(500).json({ error: 'API configuration missing on server' });
  }

  try {
    const { action } = req.body;
    
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: SMM_API_KEY, // Add API key from server env
        action: action,
        ...req.body // Pass through any other parameters
      }).toString()
    };

    const response = await fetch(SMM_API_URL, fetchOptions);
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Proxy Error', details: error.message });
  }
}
