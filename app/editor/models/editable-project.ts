import { DocumentData, WithFieldValue } from "firebase/firestore";
import { ProjectInterface } from "../../../lib/api/interfaces";
import { EditablePage, pageModelToFirestore } from "./editable-page";
import {
  ProjectImageModel,
  projectImageModelToFirestore,
} from "./project-image-model";

export class EditableProject {
  id: string;
  name: string;
  client: string;
  description: string;
  services: string;
  image?: ProjectImageModel;
  backgroundColor?: string;
  pages: EditablePage[];

  constructor(
    id: string,
    name: string,
    client: string,
    description: string,
    services: string,
    pages: EditablePage[],
    image?: ProjectImageModel,
    backgroundColor?: string
  ) {
    this.id = id;
    this.name = name;
    this.client = client;
    this.description = description;
    this.services = services;
    this.pages = pages;
    this.image = image;
    this.backgroundColor = backgroundColor;
  }

  static fromId(id: string): EditableProject {
    let name: string = id.replaceAll("-", " ");
    name = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");

    return new EditableProject(id, name, "", "", "", [
      new EditablePage(`${id}:0`),
    ]);
  }

  static fromInterface(projectInterface: ProjectInterface): EditableProject {
    return new EditableProject(
      projectInterface.id,
      projectInterface.name,
      projectInterface.client,
      projectInterface.description,
      projectInterface.services,
      projectInterface.pages.map((page) => EditablePage.fromInterface(page)),
      ProjectImageModel.fromInterface(projectInterface.image),
      projectInterface.backgroundColor
    );
  }
}

export function projectModelToFirestore(
  project: EditableProject
): WithFieldValue<DocumentData> {
  // Remove pages with empty content
  const pages = project.pages
    .filter(
      (page) =>
        (page.images != undefined && page.images.length > 0) ||
        page.videoUrl != undefined
    )
    .map((page) => pageModelToFirestore(page));

  return {
    id: project.id,
    name: project.name,
    client: project.client,
    description: project.description,
    services: project.services,
    image: projectImageModelToFirestore(project.image!),
    pages: pages,
  };
}
