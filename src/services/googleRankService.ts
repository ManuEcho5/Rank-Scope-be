import axios from 'axios';
import { RankResult } from './rankService';

interface SerpApiOrganicResult {
  position: number; // absolute position starting at 1
  link: string;
  title?: string;
  displayed_link?: string;
}

// Fetch Google ranking using SerpAPI (https://serpapi.com). Returns first occurrence.
export async function fetchGoogleRank(keyword: string, domain: string): Promise<RankResult> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    throw new Error('SERPAPI_KEY not set');
  }

  const params = new URLSearchParams({
    engine: 'google',
    q: keyword,
    api_key: apiKey,
    num: '100'
  });

  const url = `https://serpapi.com/search?${params.toString()}`;
  const res = await axios.get(url, { timeout: 15000 });
  const organic: SerpApiOrganicResult[] = res.data.organic_results || [];
  const lowerDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  const match = organic.find(r => r.link && r.link.toLowerCase().includes(lowerDomain));
  if (!match) {
    return { keyword, domain, page: null, position: null, absoluteRank: null, source: 'serpapi', stable: false };
  }
  const absoluteRank = match.position; // position provided is absolute (1-based)
  const page = Math.floor((absoluteRank - 1) / 10) + 1;
  const position = ((absoluteRank - 1) % 10) + 1;
  return { keyword, domain, page, position, absoluteRank, source: 'serpapi', stable: false, rawTitle: match.title, rawUrl: match.link };
}
