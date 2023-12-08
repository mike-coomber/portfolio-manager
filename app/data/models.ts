export interface Work {
  id: string;
  name: string;
  client: string;
  description: string;
  image: string;
  pages: Page[];
}

export interface Page {
  images: string[];
  backgroundColor: string;
}
