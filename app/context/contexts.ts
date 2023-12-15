import { createContext } from "react";
import { ProjectModel } from "../data/project-model";

const ProjectsContext = createContext<ProjectModel[]>([]);

export { ProjectsContext };
