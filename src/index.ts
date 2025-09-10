import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { RankResult } from './services/rankService.js';
import rankRoutes from './routes/rankRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());
app.use('/api', rankRoutes);

// Inline /api/check-rank route (removed separate routes module due to stale build issues)
app.get('/api/check-rank', async (req: express.Request, res: express.Response) => {
  const { keyword, domain, gl, location, location_id } = req.query as { keyword?: string; domain?: string; gl?: string; location?: string; location_id?: string };
  if (!keyword || !domain) {
    return res.status(400).json({ error: 'keyword and domain query params are required' });
  }
  if (!process.env.SERPAPI_KEY) {
    return res.status(500).json({ error: 'SERPAPI_KEY not configured on server' });
  }
  try {
    const params = new URLSearchParams({
      engine: 'google',
      q: keyword,
      api_key: process.env.SERPAPI_KEY!,
      num: '100'
    });
    // Optional location targeting
    if (gl) params.set('gl', gl.toLowerCase()); // country code
    if (location) params.set('location', location);
    if (location_id) params.set('location_id', location_id);
    const url = `https://serpapi.com/search?${params.toString()}`;
    const r = await axios.get(url, { timeout: 15000 });
    const organic: any[] = r.data.organic_results || [];
    const lowerDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const match = organic.find(o => o.link && o.link.toLowerCase().includes(lowerDomain));
    let result: RankResult;
    if (!match) {
      result = { keyword, domain, page: null, position: null, absoluteRank: null, source: 'serpapi', stable: false, gl, location, locationId: location_id };
    } else {
      const absoluteRank = match.position;
      const page = Math.floor((absoluteRank - 1) / 10) + 1;
      const position = ((absoluteRank - 1) % 10) + 1;
      result = { keyword, domain, page, position, absoluteRank, source: 'serpapi', stable: false, rawTitle: match.title, rawUrl: match.link, gl, location, locationId: location_id };
    }
    return res.json(result);
  } catch (err: any) {
    console.error('SerpAPI error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to fetch rank from SerpAPI' });
  }
});

app.get('/', (_req: express.Request, res: express.Response) => {
  res.send('Keyword Rank Checker API');
});

// Lightweight health endpoint for uptime checks
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Optional lightweight self-ping (fallback if external uptime monitor not used)
// Set SELF_PING_URL to this service's public /api/health URL. External services like UptimeRobot are preferred.
const selfPingUrl = process.env.SELF_PING_URL;
if (selfPingUrl) {
  const intervalMinutes = Number(process.env.SELF_PING_INTERVAL_MIN || 5);
  const intervalMs = intervalMinutes * 60 * 1000;
  console.log(`Self-ping enabled -> ${selfPingUrl} every ${intervalMinutes}m (exact)`);
  setInterval(() => {
    axios.get(selfPingUrl, { timeout: 5000 })
      .then(() => console.log('Self-ping ok'))
      .catch((err: unknown) => console.warn('Self-ping failed:', (err as any)?.message || err));
  }, intervalMs);
}
