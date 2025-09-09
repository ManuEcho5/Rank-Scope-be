import { Router } from 'express';
import { mockCheckRank } from '../services/rankService.js';
const router = Router();
router.get('/check-rank', (req, res) => {
    const { keyword, domain } = req.query;
    if (!keyword || !domain) {
        return res.status(400).json({ error: 'keyword and domain query params are required' });
    }
    const result = mockCheckRank(keyword, domain);
    res.json(result);
});
export default router;
