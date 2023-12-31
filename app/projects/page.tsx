import { getProjects } from "@/lib/api/data";
import { ProjectsGrid } from "../components/projects-grid";

export default async function Page() {
  const allProjects = await getProjects();

  return <ProjectsGrid initialProjects={allProjects} />;
}
