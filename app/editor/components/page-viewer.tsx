import { ContentType, EditablePage } from "@/app/editor/models/editable-page";
import { ProjectImageModel } from "@/app/editor/models/project-image-model";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";

import ReactPlayer from "react-player";

interface PageViewerProps {
  currentPage: EditablePage;
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
          <VideoPlayer url={currentPage.videoUrl} />
        )}
    </div>
  );
}

function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col gap-4 items-center">
      <ReactPlayer url={url} playing={playing} loop={true} />

      <div className="flex gap-2">
        <IconButton onClick={() => setPlaying(!playing)}>
          <span className="material-symbols-rounded">
            {playing ? "pause" : "play_arrow"}
          </span>
        </IconButton>
      </div>
    </div>
  );
}
