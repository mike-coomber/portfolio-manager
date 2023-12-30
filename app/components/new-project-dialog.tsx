import { ProjectInterface } from "@/lib/api/interfaces";
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
import { useContext, useState } from "react";

interface NewProjectDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  allProjects: ProjectInterface[];
}

export function NewProjectDialog({
  open,
  setOpen,
  allProjects,
}: NewProjectDialogProps) {
  const router = useRouter();

  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState("");

  function onSumbit() {
    const formattedId = formatId();
    if (allProjects.filter((project) => project.id == formattedId).length > 0) {
      setError("ID has already been used");
    } else if (RegExp(`[^a-zA-Z0-9-_]/\s/`).test(projectId)) {
      setError("ID Contains invalid characters");
    } else {
      router.push(`projects/add?id=${formattedId}`);
    }
  }

  function formatId(): string {
    return projectId.toLowerCase().trimEnd().replaceAll(" ", "-");
  }

  return (
    <Dialog open={open} handler={setOpen}>
      <DialogHeader className="pb-0">Create Project</DialogHeader>
      <DialogBody className="flex flex-col">
        <Typography>Enter the name for the new project below.</Typography>
        <div className="my-4">
          <Input
            crossOrigin={null}
            label="Project ID"
            error={error.length > 0}
            value={projectId}
            onChange={(e) => {
              setError("");
              setProjectId(e.target.value);
            }}
            onSubmit={onSumbit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSumbit();
              }
            }}
          />
          {error.length > 0 && (
            <Typography variant="small" color="red" className="mt-1">
              {error}
            </Typography>
          )}
          <Typography
            variant="small"
            className={clsx("opacity-0 mt-2", {
              "opacity-100": projectId.length > 0,
            })}
          >
            This ID will become: {formatId()}
          </Typography>
        </div>
        <div className="flex justify-end">
          <Button
            variant="text"
            className="mr-4"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={onSumbit}>Create</Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
