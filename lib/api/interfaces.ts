// Interfaces representing the structure of the JSON data from Firebase

export interface ProjectInterface {
  name: string;
  id: string;
  client: string;
  description: string;
  services: string;
  image: ImageInterface;
  backgroundColor: string;
  pages: PageInterface[];
}

export interface PageInterface {
  id: string;
  images: ImageInterface[] | undefined;
  videoUrl: string | undefined;
  backgroundColor: string;
}

export interface ImageInterface {
  name: string;
  url: string;
}
