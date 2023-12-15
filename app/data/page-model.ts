import { DocumentData, WithFieldValue } from "firebase/firestore";
import { PageInterface } from "../api/interfaces";
import { ProjectImageModel } from "./project-image-model";

export class PageModel {
  images: ProjectImageModel[];
  backgroundColor: string | undefined;
  pageNumber: number;

  constructor(
    images: ProjectImageModel[],
    pageNumber: number,
    backgroundColor?: string
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

    return new PageModel(images, pageNumber, pageInterface.backgroundColor);
  }
}

export function pageModelToFirestore(
  page: PageModel
): WithFieldValue<DocumentData> {
  return {
    backgroundColor: page.backgroundColor,
    images: page.images.map((image) => image.firebaseLocaiton),
  };
}
