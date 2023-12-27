import {
  Button,
  Dialog,
  DialogBody,
  Typography,
} from "@material-tailwind/react";

interface ConfirmationDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  setOpen,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} handler={setOpen} size="sm">
      <DialogBody className="flex flex-col items-center justify-center">
        <Typography>Are you sure you want to delete this project?</Typography>
        <div className="mt-4">
          <Button
            variant="text"
            onClick={() => setOpen(false)}
            className="mr-4"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
