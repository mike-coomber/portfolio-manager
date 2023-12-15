import { ProjectImageModel } from "@/app/data/project-image-model";
import { ProjectModel } from "@/app/data/project-model";
import { createContext } from "react";

interface ProjectContextModel {
  project: ProjectModel;
  setProject: (val: ProjectModel) => void;
}

export const ProjectContext = createContext<ProjectContextModel>({
  project: ProjectModel.empty(),
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
