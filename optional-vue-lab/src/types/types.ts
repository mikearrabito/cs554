export interface MarvelInfo {
  id: number;
  description: string;
  name?: string; // Characters have a "name" field
  title?: string; // Comics and series have a "title" field
  thumbnail: { path: string; extension: string };
  comics?: { items: Array<{ resourceURI: string; name: string }> };
  series?: { items: Array<{ resourceURI: string; name: string }> };
  characters?: { items: Array<{ resourceURI: string; name: string }> };
  stories: {
    items: Array<{ resourceURI: string; name: string; type: string }>;
  };
  prices?: Array<{
    type: string;
    price: number;
  }>;
  creators?: {
    items: Array<{ resourceURI: string; name: string; role: string }>;
  };
}

export interface MarvelApiResponse {
  count: number;
  limit: number;
  offset: number;
  total: number;
  page: number | null; // appended in api/index.ts, not originally sent with response, but adding to make it easier to reference the page
  results: Array<MarvelInfo>;
}
