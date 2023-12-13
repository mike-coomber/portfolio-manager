import { getImageUrl } from "./api";
import { PageInterface, ProjectInterface } from "./interfaces";

export class ProjectModel {
  id: string;
  name: string;
  client: string;
  description: string;
  services: string;
  imageUrl: string;
  pages: PageModel[];

  constructor(
    id: string,
    name: string,
    client: string,
    description: string,
    services: string,
    image: string,
    pages: PageModel[]
  ) {
    this.id = id;
    this.name = name;
    this.client = client;
    this.description = description;
    this.services = services;
    this.imageUrl = image;
    this.pages = pages;
  }

  static empty(): ProjectModel {
    return new ProjectModel("", "", "", "", "", "", []);
  }

  static async fromInterface(
    id: string,
    projectInterface: ProjectInterface
  ): Promise<ProjectModel> {
    const imageUrl = await getImageUrl(projectInterface.image);
    const pageModels = await Promise.all(
      projectInterface.pages.map((page, index) =>
        PageModel.fromInterface(page, index)
      )
    );

    return new ProjectModel(
      id,
      projectInterface.name,
      projectInterface.client,
      projectInterface.description,
      projectInterface.services,
      imageUrl,
      pageModels
    );
  }
}

export class PageModel {
  images: ProjectImageModel[];
  backgroundColor: string;
  pageNumber: number;

  constructor(
    images: ProjectImageModel[],
    backgroundColor: string,
    pageNumber: number
  ) {
    this.images = images;
    this.backgroundColor = backgroundColor;
    this.pageNumber = pageNumber;
  }

  static async fromInterface(
    pageInterface: PageInterface,
    pageNumber: number
  ): Promise<PageModel> {
    const images = await Promise.all(
      pageInterface.images.map((location) => {
        return ProjectImageModel.fromFirebaseLocation(location);
      })
    );

    return new PageModel(images, pageInterface.backgroundColor, pageNumber);
  }
}

export class ProjectImageModel {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  static async fromFirebaseLocation(
    location: string
  ): Promise<ProjectImageModel> {
    const url = await getImageUrl(location);
    const splitLocation = location.split("/");
    const name = splitLocation[splitLocation.length - 1];

    return new ProjectImageModel(name, url);
  }
}
