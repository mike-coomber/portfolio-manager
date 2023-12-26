"use client";
import { ProjectsContext } from "@/app/context/contexts";
import { getAllImages, writeProject } from "@/app/api/api";
import { ProjectImageModel } from "@/app/data/project-image-model";
import { Button } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ImagesContext, PageIndexContext, ProjectContext } from "./context";
import { ProjectModel } from "@/app/data/project-model";
import { ProjectInfo } from "./components/project-info";
import { PageSelector } from "./components/page-selector";
import { PageViewer } from "./components/page-viewer";
import Link from "next/link";

export function Editor({ initialProject }: { initialProject: ProjectModel }) {
  const [project, setProject] = useState<ProjectModel>(initialProject);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [allImages, setAllImages] = useState<ProjectImageModel[]>([]);

  const { allProjects, setAllProjects } = useContext(ProjectsContext);

  useEffect(() => {
    getAllImages(project.id).then((images) => setAllImages(images));
  }, []);

  if (project == undefined) {
    return <>404</>;
  }

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      <ImagesContext.Provider
        value={{ images: allImages, setImages: setAllImages }}
      >
        <PageIndexContext.Provider
          value={{ currentPageIndex, setCurrentPageIndex }}
        >
          <ProjectInfo />
          <div className="flex flex-1">
            <PageSelector />
            {currentPageIndex != undefined && <PageViewer />}
          </div>
          <footer className="flex w-full bg-white p-4 justify-between z-10">
            <Link href={"/dashboard"}>
              <Button variant="text" className="mr-4">
                Back
              </Button>
            </Link>
            <div>
              <Button
                variant="text"
                className="mr-4"
                onClick={() => {
                  setProject(initialProject);
                  setCurrentPageIndex(0);
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  const projectIndex = allProjects.indexOf(initialProject);
                  if (projectIndex > -1) {
                    const projectsCopy = [...allProjects];

                    projectsCopy.splice(projectIndex, 1, project);

                    setAllProjects(projectsCopy);
                  }

                  writeProject(project);
                }}
              >
                Save
              </Button>
            </div>
          </footer>
        </PageIndexContext.Provider>
      </ImagesContext.Provider>
    </ProjectContext.Provider>
  );
}
