import { Router, Request, Response } from 'express';
import { fetchGoogleRank } from '../services/googleRankService.js';
import { fetchSerpApiUsage } from '../services/serpApiUsageService.js';


// Route version marker to bust stale build caches
export const __ROUTE_VERSION = 'serpapi-only-v2';


const router = Router();

// Endpoint to get SERP API usage/quota
router.get('/serpapi-usage', async (req: Request, res: Response) => {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'SERPAPI_KEY not configured on server' });
  }
  try {
    const usage = await fetchSerpApiUsage(apiKey);
    return res.json(usage);
  } catch (err: any) {
    console.error('SerpAPI usage error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to fetch SerpAPI usage' });
  }
});

router.get('/check-rank', (req: Request, res: Response) => {
  const { keyword, domain } = req.query as { keyword?: string; domain?: string };
  if (!keyword || !domain) {
    return res.status(400).json({ error: 'keyword and domain query params are required' });
  }
  if (!process.env.SERPAPI_KEY) {
    return res.status(500).json({ error: 'SERPAPI_KEY not configured on server' });
  }
  (async () => {
    try {
      const result = await fetchGoogleRank(keyword, domain);
      return res.json(result);
    } catch (err: any) {
      console.error('SerpAPI error:', err?.message || err);
      return res.status(500).json({ error: 'Failed to fetch rank from SerpAPI' });
    }
  })();
});

export default router;
