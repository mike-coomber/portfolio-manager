import { Button, Dialog, Input } from "@material-tailwind/react";
import { useState } from "react";

interface VideoUrlDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  initialUrl: string | undefined;
  onUrlSelected: (url: string) => void;
}

export function VideoUrlDialog({
  open,
  setOpen,
  initialUrl,
  onUrlSelected,
}: VideoUrlDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState(false);

  return (
    <Dialog open={open} handler={setOpen} className="p-8 flex ">
      <Input
        crossOrigin={null}
        label="Video URL"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        defaultValue={initialUrl}
        onClick={() => setError(false)}
        error={error}
      />
      <Button
        className="ml-2"
        onClick={() => {
          if (url && url.length > 0) {
            onUrlSelected(url);
            setOpen(false);
          } else {
            setError(true);
          }
        }}
      >
        Submit
      </Button>
    </Dialog>
  );
}
