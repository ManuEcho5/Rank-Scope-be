import axios from 'axios';

export async function fetchSerpApiUsage(apiKey: string) {
  const url = `https://serpapi.com/account`;
  const params = { api_key: apiKey };
  const response = await axios.get(url, { params });
  return {
    searchesPerformed: response.data.api_key_usage,
    searchesLimit: response.data.api_key_limit,
  };
}
