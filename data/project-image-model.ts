import { getImageUrl } from "../api/api";
import { getFileNameFromLocation } from "../utils/get-location-name";

export class ProjectImageModel {
  name: string;
  firebaseLocaiton: string;
  url: string;

  constructor(name: string, firebaseLocaiton: string, url: string) {
    this.name = name;
    this.firebaseLocaiton = firebaseLocaiton;
    this.url = url;
  }

  static async fromFirebaseLocation(
    location: string
  ): Promise<ProjectImageModel> {
    const url = await getImageUrl(location);
    const name = getFileNameFromLocation(location);

    return new ProjectImageModel(name, location, url);
  }
}
