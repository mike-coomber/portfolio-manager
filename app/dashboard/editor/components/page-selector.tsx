import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import { PageIndexContext, ProjectContext } from "../context";
import { PageModel } from "@/app/data/page-model";

export function PageSelector({}: {}) {
  const { project } = useContext(ProjectContext);
  const { setCurrentPageIndex } = useContext(PageIndexContext);

  const pages = project.pages;

  const pageComponents = pages.map((page, index) => (
    <div
      key={index}
      className="p-2 cursor-pointer"
      onClick={() => setCurrentPageIndex(index)}
    >
      <Typography>Page {index + 1}</Typography>
    </div>
  ));

  pageComponents.push(<NewPage />);

  return (
    <div className="px-4 py-2 bg-white shadow-md flex-initial w-40">
      {pageComponents}
    </div>
  );
}

function NewPage() {
  const { project, setProject } = useContext(ProjectContext);
  const { currentPageIndex, setCurrentPageIndex } =
    useContext(PageIndexContext);

  return (
    <div
      key={"new-page"}
      className="border-2 border-dashed border-black flex items-center justify-center cursor-pointer px-4 py-2"
      onClick={() => {
        const newPageIndex = currentPageIndex + 1;
        setProject({
          ...project,
          pages: [...project.pages, new PageModel([], newPageIndex)],
        });
        setCurrentPageIndex(newPageIndex);
      }}
    >
      <Typography>Add page</Typography>
    </div>
  );
}
