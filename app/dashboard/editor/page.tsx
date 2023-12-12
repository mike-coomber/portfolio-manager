"use client";
import { WorkContext } from "@/app/context/contexts";
import { getAllImages } from "@/app/data/api";
import { PageModel, ProjectImageModel, ProjectModel } from "@/app/data/models";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ImagePickerDialog } from "./components/image-picker-dialog";

export default function Page() {
  const [work, setWork] = useState<ProjectModel | undefined>();
  const [currentPage, setCurrentPage] = useState<PageModel>();
  const [allImages, setAllImages] = useState<ProjectImageModel[]>([]);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const allWork = useContext(WorkContext);
  const queryParams = useSearchParams();

  useEffect(() => {
    const id = queryParams.get("id");
    const match = allWork.find((work) => work.id == id);
    setWork(match);
    setCurrentPage(match?.pages[0]);

    getAllImages(id!).then((images) => setAllImages(images));
  }, []);

  if (work == undefined) {
    return <>404</>;
  }

  return (
    <div className="h-full">
      <TopBar work={work} />
      <div className="flex">
        <PageSelector pages={work.pages} onPageSelected={setCurrentPage} />
        {currentPage != undefined && (
          <PageView
            page={currentPage}
            setImagePickerOpen={setImagePickerOpen}
          />
        )}
      </div>
      <ImagePickerDialog
        open={imagePickerOpen}
        setOpen={setImagePickerOpen}
        images={allImages}
      />
    </div>
  );
}

function PageSelector({
  pages,
  onPageSelected,
}: {
  pages: PageModel[];
  onPageSelected: (page: PageModel) => void;
}) {
  return (
    <div className="px-4 py-2 bg-white shadow-md flex-initial w-40">
      {pages.map((page, index) => (
        <div
          key={index}
          className="p-2 cursor-pointer"
          onClick={() => onPageSelected(page)}
        >
          <Typography>Page {index + 1}</Typography>
        </div>
      ))}
    </div>
  );
}

function PageView({
  page,
  setImagePickerOpen,
}: {
  page: PageModel;
  setImagePickerOpen: Function;
}) {
  return (
    <div className="flex-1 bg-red-50 p-12">
      <Typography>Page preview</Typography>
      <Button variant="text" onClick={() => setImagePickerOpen(true)}>
        Open Image Picker
      </Button>
      <div className="flex">
        {page.images.map((image) => (
          <Image
            key={image.name}
            src={image.url}
            alt={image.name}
            width={400}
            height={400}
            className="flex-1 p-2"
            style={{ maxHeight: 400, objectFit: "contain" }}
          />
        ))}
      </div>
    </div>
  );
}

function TopBar({ work }: { work: ProjectModel }) {
  return (
    <form
      onChange={(e) => {
        const formData = new FormData(e.currentTarget);
      }}
    >
      <div className="p-6 bg-white flex shadow-md">
        <div className="flex-col flex-1">
          <div className="flex-3">
            <Input
              label="Name"
              type="text"
              name="name"
              defaultValue={work.name}
              variant="static"
              crossOrigin={""}
            />
          </div>
          <div className="flex-1 mt-4">
            <Input
              type="text"
              label="Services"
              name="services"
              defaultValue={work.services}
              variant="static"
              crossOrigin={""}
            />
          </div>
        </div>
        <div className="flex-1 ml-4 h-max mt-2">
          <Textarea
            name="description"
            label="Description"
            defaultValue={work.description}
          />
        </div>
      </div>
    </form>
  );
}
