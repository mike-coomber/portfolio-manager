"use client";
import { WorkContext } from "@/app/context/contexts";
import { getAllImages } from "@/app/data/api";
import { PageModel, ProjectImageModel, ProjectModel } from "@/app/data/models";
import { Input, Textarea, Typography } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const [work, setWork] = useState<ProjectModel | undefined>();
  const [currentPage, setCurrentPage] = useState<PageModel>();
  const [allImages, setAllImages] = useState<ProjectImageModel[]>([]);

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
        {currentPage != undefined && <PageView page={currentPage} />}
        <ImageViewer images={allImages} />
      </div>
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
          className="p-2 cursor-pointer"
          onClick={() => onPageSelected(page)}
        >
          <Typography>Page {index + 1}</Typography>
        </div>
      ))}
    </div>
  );
}

function PageView({ page }: { page: PageModel }) {
  console.log(page);
  return (
    <div className="flex-1 bg-red-50 p-12">
      <Typography>Page preview</Typography>
      {page.images.map((image) => (
        <Image
          width={80}
          height={80}
          src={image.url}
          alt={image.name}
          className="h-auto w-auto"
        />
      ))}
    </div>
  );
}

function ImageViewer({ images }: { images: ProjectImageModel[] }) {
  return (
    <div className="shadow-md flex-initial bg-white">
      {images.map((image) => (
        <div className="flex px-4 py-4">
          <Image src={image.url} height={40} width={40} alt="image.name" />
          <Typography className="ml-4">{image.name}</Typography>
        </div>
      ))}
    </div>
  );
}

function TopBar({ work }: { work: ProjectModel }) {
  return (
    <form
      onChange={(e) => {
        console.log(e);
        const formData = new FormData(e.currentTarget);
        console.log(formData);
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
