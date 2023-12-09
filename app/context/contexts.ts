import { createContext, useContext } from "react";
import { Work } from "../data/models";

const WorkContext = createContext<Work[]>([]);

export { WorkContext };
