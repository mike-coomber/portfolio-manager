// Interfaces representing the structure of the JSON data from Firebase

export interface ProjectInterface {
  name: string;
  client: string;
  description: string;
  services: string;
  image: string;
  backgroundColor: string;
  pages: PageInterface[];
}

export interface PageInterface {
  id: string;
  images: string[] | undefined;
  videoUrl: string | undefined;
  backgroundColor: string;
}
