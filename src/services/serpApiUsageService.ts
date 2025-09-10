import axios from 'axios';

export async function fetchSerpApiUsage(apiKey: string) {
  if (!apiKey) {
    throw new Error('SERPAPI_KEY is missing');
  }
  const url = `https://serpapi.com/account`;
  const params = { api_key: apiKey };
  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    // Log once for debugging
    console.log('SerpAPI /account response:', data);
    if (
      typeof data.this_month_usage === 'number' &&
      typeof data.searches_per_month === 'number'
    ) {
      return {
        searchesPerformed: data.this_month_usage,
        searchesLimit: data.searches_per_month,
        searchesRemaining: data.plan_searches_left ?? data.total_searches_left
      };
    } else {
      return { searchesPerformed: 0, searchesLimit: 1, error: 'Unexpected SerpAPI response' };
    }
  } catch (err) {
    console.error('Error fetching SerpAPI usage:', err);
    return { searchesPerformed: 0, searchesLimit: 1, error: 'Failed to fetch usage' };
  }
}
