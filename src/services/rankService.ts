export interface RankResult {
  keyword: string;
  domain: string;
  page: number | null;      // SERP page (1-based)
  position: number | null;  // Position within page (1..10)
  absoluteRank?: number | null; // Absolute rank (1..100) when found
  source: 'serpapi';
  stable: boolean;          // true if deterministic (not applicable for live API, remains false)
  rawTitle?: string;
  rawUrl?: string;
}
