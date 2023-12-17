import { DocumentData, WithFieldValue } from "firebase/firestore";
import { PageInterface } from "../api/interfaces";
import { ProjectImageModel } from "./project-image-model";

export class PageModel {
  images: ProjectImageModel[];
  backgroundColor: string | undefined;
  id: string;

  constructor(
    images: ProjectImageModel[],
    id: string,
    backgroundColor?: string
  ) {
    this.images = images;
    this.backgroundColor = backgroundColor;
    this.id = id;
  }

  static async fromInterface(pageInterface: PageInterface): Promise<PageModel> {
    const images = await Promise.all(
      pageInterface.images.map((location) => {
        return ProjectImageModel.fromFirebaseLocation(location);
      })
    );

    return new PageModel(
      images,
      pageInterface.id,
      pageInterface.backgroundColor
    );
  }
}

export function pageModelToFirestore(
  page: PageModel
): WithFieldValue<DocumentData> {
  return {
    ...(page.backgroundColor && { backgroundColor: page.backgroundColor }),
    images: page.images.map((image) => image.firebaseLocaiton),
  };
}
