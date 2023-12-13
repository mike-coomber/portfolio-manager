import { createContext } from "react";
import { ProjectModel } from "../data/models";

const WorkContext = createContext<ProjectModel[]>([]);

export { WorkContext };
