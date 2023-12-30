import { ImageInterface } from "@/lib/api/interfaces";

export class ProjectImageModel {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  static fromInterface(imageInterface: ImageInterface): ProjectImageModel {
    return new ProjectImageModel(imageInterface.name, imageInterface.url);
  }
}

export function projectImageModelToFirestore(model: ProjectImageModel) {
  return {
    name: model.name,
    url: model.url,
  };
}
