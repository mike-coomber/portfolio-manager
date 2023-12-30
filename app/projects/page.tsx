import { ReactElement } from "react";
import { ProjectCard } from "../components/project-card";
import { NewProjectTile } from "../components/new-project-tile";
import { getAllProjects } from "@/lib/api/data";
import { projectImageModelToFirestore } from "@/app/editor/models/project-image-model";

export default async function Page() {
  const allProjects = await getAllProjects();

  const tiles = allProjects.map((project) => (
    <ProjectCard
      key={project.id}
      projectName={project.name}
      projectId={project.id}
      projectImage={projectImageModelToFirestore(project.image!)}
    />
  ));

  tiles.push(<NewProjectTile />);

  return (
    <div
      className={`grid auto-rows-fr sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`}
    >
      {tiles.map((tile, index) => (
        <GridItem key={index}>{tile}</GridItem>
      ))}
    </div>
  );
}

function GridItem({ children }: { children: ReactElement }) {
  return <div className="flex flex-1 p-8">{children}</div>;
}
