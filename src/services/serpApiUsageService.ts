import axios from 'axios';

export async function fetchSerpApiUsage(apiKey: string) {
  if (!apiKey) {
    throw new Error('SERPAPI_KEY is missing');
  }
  const url = `https://serpapi.com/account`;
  const params = { api_key: apiKey };
  try {
    const response = await axios.get(url, { params });
    console.log('SerpAPI /account response:', response.data);
    if (
      typeof response.data.api_key_usage === 'number' &&
      typeof response.data.api_key_limit === 'number'
    ) {
      return {
        searchesPerformed: response.data.api_key_usage,
        searchesLimit: response.data.api_key_limit,
      };
    } else {
      throw new Error('Unexpected SerpAPI response: ' + JSON.stringify(response.data));
    }
  } catch (err) {
    console.error('Error fetching SerpAPI usage:', err);
    return { searchesPerformed: 0, searchesLimit: 1, error: 'Failed to fetch usage' };
  }
}
