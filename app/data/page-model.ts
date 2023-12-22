import { DocumentData, WithFieldValue } from "firebase/firestore";
import { PageInterface } from "../api/interfaces";
import { ProjectImageModel } from "./project-image-model";

export class PageModel {
  images: ProjectImageModel[] | undefined;
  videoUrl: string | undefined;
  backgroundColor: string | undefined;
  id: string;

  constructor(
    id: string,
    images?: ProjectImageModel[] | undefined,
    videoUrl?: string | undefined,
    backgroundColor?: string
  ) {
    this.images = images;
    this.videoUrl = videoUrl;
    this.backgroundColor = backgroundColor;
    this.id = id;
  }

  static async fromInterface(pageInterface: PageInterface): Promise<PageModel> {
    const images =
      pageInterface.images != undefined
        ? await Promise.all(
            pageInterface.images.map((location) => {
              return ProjectImageModel.fromFirebaseLocation(location);
            })
          )
        : undefined;

    return new PageModel(
      pageInterface.id,
      images,
      pageInterface.videoUrl,
      pageInterface.backgroundColor
    );
  }
}

export function pageModelToFirestore(
  page: PageModel
): WithFieldValue<DocumentData> {
  return {
    ...(page.backgroundColor && { backgroundColor: page.backgroundColor }),
    ...(page.videoUrl && { videoUrl: page.videoUrl }),
    ...(page.images &&
      page.videoUrl == undefined && {
        images: page.images.map((image) => image.firebaseLocaiton),
      }),
  };
}
