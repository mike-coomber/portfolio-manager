export interface Work {
  id: string;
  name: string;
  client: string;
  description: string;
  services: string;
  image: string;
  pages: Page[];
}

export interface Page {
  images: string[];
  backgroundColor: string;
}

export class WorkImage {
  url: string;
  name: string;

  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
  }
}
