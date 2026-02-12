
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers to allow your frontend to communicate with this proxy
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  const targetUrl = decodeURIComponent(Array.isArray(url) ? url[0] : url);

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };

    // Forward the body if it's a POST request
    if (req.method === 'POST' && req.body) {
      // If req.body is already an object, convert to form-urlencoded string
      const bodyParams = new URLSearchParams();
      for (const key in req.body) {
        bodyParams.append(key, req.body[key]);
      }
      fetchOptions.body = bodyParams.toString();
    }

    const response = await fetch(targetUrl, fetchOptions);
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
