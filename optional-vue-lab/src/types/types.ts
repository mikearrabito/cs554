export interface MarvelInfo {
  id: number;
  description: string;
  name?: string; // Characters have a "name" field
  title?: string; // Comics and series have a "title" field
  thumbnail: { path: string; extension: string };
  comics: { items: Array<{ resourceURI: string; name: string }> };
  series: { items: Array<{ resourceURI: string; name: string }> };
  stories: {
    items: Array<{ resourceURI: string; name: string; type: string }>;
  };
}
