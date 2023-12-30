import { ProjectImageModel } from "@/app/editor/models/project-image-model";
import { EditableProject } from "@/app/editor/models/editable-project";
import { createContext } from "react";

interface ProjectContextModel {
  project: EditableProject;
  setProject: (val: EditableProject) => void;
}

export const EditableProjectContext = createContext<ProjectContextModel>({
  project: EditableProject.fromId("none"),
  setProject: (val) => {},
});

interface ImagesContextModel {
  images: ProjectImageModel[];
  setImages: (images: ProjectImageModel[]) => void;
}

export const ImagesContext = createContext<ImagesContextModel>({
  images: [],
  setImages: (val) => {},
});

interface PageIndexContextModel {
  currentPageIndex: number;
  setCurrentPageIndex: (val: number) => void;
}

export const PageIndexContext = createContext<PageIndexContextModel>({
  currentPageIndex: 0,
  setCurrentPageIndex: (val) => {},
});
