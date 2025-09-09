import { Router, Request, Response } from 'express';
import { fetchGoogleRank } from '../services/googleRankService';

const router = Router();

router.get('/check-rank', (req: Request, res: Response) => {
  const { keyword, domain } = req.query as { keyword?: string; domain?: string };
  if (!keyword || !domain) {
    return res.status(400).json({ error: 'keyword and domain query params are required' });
  }
  if (!process.env.SERPAPI_KEY) {
    return res.status(500).json({ error: 'SERPAPI_KEY not configured on server' });
  }
  fetchGoogleRank(keyword, domain)
    .then(result => res.json(result))
    .catch(err => {
      console.error('SerpAPI error:', err?.message || err);
      res.status(500).json({ error: 'Failed to fetch rank from SerpAPI' });
    });
});

export default router;
