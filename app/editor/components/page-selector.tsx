import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import { PageIndexContext, EditableProjectContext } from "../context";
import { EditablePage } from "@/app/editor/models/editable-page";
import clsx from "clsx";

export function PageSelector() {
  const { project, setProject } = useContext(EditableProjectContext);
  const { currentPageIndex, setCurrentPageIndex } =
    useContext(PageIndexContext);

  const pages = project.pages;

  const pageComponents = pages.map((page, index) => (
    <div
      key={index}
      className={clsx(
        `py-2 px-4 cursor-pointer flex justify-between group hover:bg-gray-400 rounded-md`,
        {
          "bg-gray-300": index == currentPageIndex,
        }
      )}
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

  return (
    <div className="px-4 py-2 bg-white shadow-md flex-initial min-w-max w-40 max-h-full">
      <div className="grid grid-cols-1 divide-y divide-slate-50 gap-2">
        {pageComponents}
        <div>
          <NewPageTile />
        </div>
      </div>
    </div>
  );
}

function NewPageTile() {
  const { project, setProject } = useContext(EditableProjectContext);
  const { setCurrentPageIndex } = useContext(PageIndexContext);

  return (
    <div
      key={"new-page"}
      className="border-2 border-dashed border-black flex items-center justify-center cursor-pointer px-4 py-2 rounded-md mt-2"
      onClick={() => {
        const newPageIndex = project.pages.length;
        setProject({
          ...project,
          pages: [
            ...project.pages,
            new EditablePage(`${project.id}:${newPageIndex}`),
          ],
        });
        setCurrentPageIndex(newPageIndex);
      }}
    >
      <Typography>Add page</Typography>
    </div>
  );
}
