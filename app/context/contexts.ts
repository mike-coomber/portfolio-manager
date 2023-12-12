import { createContext, useContext } from "react";
import { ProjectInterface } from "../data/models";

const WorkContext = createContext<ProjectInterface[]>([]);

export { WorkContext };
