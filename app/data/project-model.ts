import { DocumentData, WithFieldValue } from "firebase/firestore";
import { getImageUrl } from "../api/api";
import { ProjectInterface } from "../api/interfaces";
import { getFileNameFromLocation } from "../utils/get-location-name";
import { PageModel, pageModelToFirestore } from "./page-model";
import { ProjectImageModel } from "./project-image-model";

export class ProjectModel {
  id: string;
  name: string;
  client: string;
  description: string;
  services: string;
  image?: ProjectImageModel;
  pages: PageModel[];

  constructor(
    id: string,
    name: string,
    client: string,
    description: string,
    services: string,
    pages: PageModel[],
    image?: ProjectImageModel
  ) {
    this.id = id;
    this.name = name;
    this.client = client;
    this.description = description;
    this.services = services;
    this.pages = pages;
    this.image = image;
  }

  static empty(): ProjectModel {
    return new ProjectModel("", "", "", "", "", []);
  }

  static async fromInterface(
    id: string,
    projectInterface: ProjectInterface
  ): Promise<ProjectModel> {
    const imageName = getFileNameFromLocation(projectInterface.image);
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
      pageModels,
      new ProjectImageModel(imageName, projectInterface.image, imageUrl)
    );
  }
}

export function projectModelToFirestore(
  project: ProjectModel
): WithFieldValue<DocumentData> {
  return {
    id: project.id,
    name: project.name,
    client: project.client,
    description: project.description,
    services: project.services,
    image: project.image?.firebaseLocaiton,
    pages: project.pages.map((page) => pageModelToFirestore(page)),
  };
}
