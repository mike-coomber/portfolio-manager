import { ProjectModel } from "@/app/data/models";
import { createContext } from "react";

interface ProjectContextModel {
  project: ProjectModel;
  setProject: (val: ProjectModel) => void;
}

export const ProjectContext = createContext<ProjectContextModel>({
  project: ProjectModel.empty(),
  setProject: (val) => {},
});
