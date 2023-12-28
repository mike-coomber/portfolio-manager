import { ContentType, PageModel } from "@/data/page-model";
import { ProjectImageModel } from "@/data/project-image-model";
import { Button, Typography } from "@material-tailwind/react";
import Image from "next/image";

import ReactPlayer from "react-player";

interface PageViewerProps {
  currentPage: PageModel;
  contentType: ContentType;
  onImageDeleted: (image: ProjectImageModel) => void;
}

export function PageViewer({
  currentPage,
  contentType,
  onImageDeleted,
}: PageViewerProps) {
  return (
    <div className="flex items-center justify-center p-12">
      {contentType == ContentType.images &&
        currentPage.images &&
        currentPage.images.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              key={image.name}
              src={image.url}
              alt={image.name}
              width={400}
              height={400}
              className="flex-1 p-2"
              style={{ maxHeight: 400, objectFit: "contain" }}
            />
            <Button
              variant="text"
              size="sm"
              onClick={() => onImageDeleted(image)}
            >
              <div className="flex">
                <span className="material-symbols-rounded">delete</span>
                <Typography className="mt-0.5 ml-1" variant="small">
                  Delete
                </Typography>
              </div>
            </Button>
          </div>
        ))}
      {contentType == ContentType.video &&
        currentPage.videoUrl != undefined && (
          <ReactPlayer url={currentPage.videoUrl} />
        )}
    </div>
  );
}
