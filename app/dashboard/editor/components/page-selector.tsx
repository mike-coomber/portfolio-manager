import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import { PageIndexContext, ProjectContext } from "../context";
import { PageModel } from "@/app/data/page-model";

export function PageSelector() {
  const { project, setProject } = useContext(ProjectContext);
  const { currentPageIndex, setCurrentPageIndex } =
    useContext(PageIndexContext);

  const pages = project.pages;

  const pageComponents = pages.map((page, index) => (
    <div
      key={index}
      className="p-2 cursor-pointer flex justify-between group"
      onClick={() => setCurrentPageIndex(index)}
    >
      <Typography>Page {index + 1}</Typography>
      {pages.length > 1 && (
        <span
          key={"delete button"}
          className="material-symbols-rounded hidden group-hover:flex"
          onClick={(e) => {
            e.stopPropagation();
            if (currentPageIndex == index) {
              setCurrentPageIndex(Math.max(index - 1, 0));
            }
            setProject({
              ...project,
              pages: project.pages.filter((val) => val != page),
            });
          }}
        >
          delete
        </span>
      )}
    </div>
  ));

  pageComponents.push(<NewPageTile />);

  return (
    <div className="px-4 py-2 bg-white shadow-md flex-initial w-40">
      {pageComponents}
    </div>
  );
}

function NewPageTile() {
  const { project, setProject } = useContext(ProjectContext);
  const { setCurrentPageIndex } = useContext(PageIndexContext);

  return (
    <div
      key={"new-page"}
      className="border-2 border-dashed border-black flex items-center justify-center cursor-pointer px-4 py-2"
      onClick={() => {
        const newPageIndex = project.pages.length;
        setProject({
          ...project,
          pages: [
            ...project.pages,
            new PageModel(`${project.id}:${newPageIndex}`),
          ],
        });
        setCurrentPageIndex(newPageIndex);
      }}
    >
      <Typography>Add page</Typography>
    </div>
  );
}
