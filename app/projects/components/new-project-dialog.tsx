import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NewProjectDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export function NewProjectDialog({ open, setOpen }: NewProjectDialogProps) {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState(false);

  function onSumbit() {
    router.push(`projects/add?id=${formatId()}`);
  }

  function formatId(): string {
    return projectId.toLowerCase().replaceAll(" ", "-");
  }

  return (
    <Dialog open={open} handler={setOpen}>
      <DialogHeader>Create Project</DialogHeader>
      <DialogBody className="flex flex-col">
        <Typography>Enter an ID for the new project below.</Typography>
        <div className="my-4">
          <Input
            crossOrigin={null}
            label="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            onSubmit={onSumbit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSumbit();
              }
            }}
          />
          <Typography
            variant="small"
            className={clsx("opacity-0", {
              "opacity-100": projectId.length > 0,
            })}
          >
            This ID will become: {formatId()}
          </Typography>
        </div>
        <Button className="self-end" onClick={onSumbit}>
          Create
        </Button>
      </DialogBody>
    </Dialog>
  );
}
