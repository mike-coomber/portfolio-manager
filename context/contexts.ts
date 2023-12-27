import { createContext } from "react";
import { ProjectModel } from "../data/project-model";

interface ProjectsContextModel {
  allProjects: ProjectModel[];
  setAllProjects: (val: ProjectModel[]) => void;
}

const ProjectsContext = createContext<ProjectsContextModel>({
  allProjects: [],
  setAllProjects: (val) => {},
});

export { ProjectsContext };
