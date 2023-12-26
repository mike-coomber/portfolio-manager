import { ProjectImageModel } from "@/app/data/project-image-model";
import { ProjectModel } from "@/app/data/project-model";
import { create } from "domain";
import { createContext } from "react";

interface ProjectContextModel {
  project: ProjectModel;
  setProject: (val: ProjectModel) => void;
}

export const ProjectContext = createContext<ProjectContextModel>({
  project: ProjectModel.fromId("none"),
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
