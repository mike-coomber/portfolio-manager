import { DocumentData, WithFieldValue } from "firebase/firestore";
import { PageInterface } from "../../../api/interfaces";
import {
  ProjectImageModel,
  projectImageModelToFirestore,
} from "./project-image-model";

export enum ContentType {
  images,
  video,
}

export class EditablePage {
  images: ProjectImageModel[] | undefined;
  videoUrl: string | undefined;
  backgroundColor: string | undefined;
  id: string;
  contentType: ContentType;

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
    this.contentType = videoUrl ? ContentType.video : ContentType.images;
  }

  static fromInterface(pageInterface: PageInterface): EditablePage {
    return new EditablePage(
      pageInterface.id,
      pageInterface.images?.map((image) =>
        ProjectImageModel.fromInterface(image)
      ),
      pageInterface.videoUrl,
      pageInterface.backgroundColor
    );
  }
}

export function pageModelToFirestore(
  page: EditablePage
): WithFieldValue<DocumentData> {
  return {
    ...(page.backgroundColor && { backgroundColor: page.backgroundColor }),
    ...(page.videoUrl &&
      page.contentType == ContentType.video && { videoUrl: page.videoUrl }),
    ...(page.images &&
      (page.contentType == ContentType.images || !page.videoUrl) && {
        images: page.images.map((image) => projectImageModelToFirestore(image)),
      }),
  };
}
