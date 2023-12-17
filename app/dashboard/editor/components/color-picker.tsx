import { Button, Typography, collapse } from "@material-tailwind/react";
import { useState } from "react";
import { ChromePicker } from "react-color";

export function ColorPicker({
  onColorSelected,
  initialColor,
  showInline,
  onResetPressed,
  onDeletePressed,
}: {
  onColorSelected: (color: string) => void;
  initialColor: string | undefined;
  showInline?: boolean;
  onResetPressed?: () => void;
  onDeletePressed?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor ?? "white");

  return (
    <>
      <div className="flex flex-col relative items-center justify-center">
        {showInline ? (
          <div className="flex flex-col justify-center items-center">
            <Typography>Color picker</Typography>
            <div className="flex">
              <Button variant="text" onClick={() => setOpen(true)}>
                <span className="material-symbols-rounded">colorize</span>
              </Button>
              <Button variant="text" onClick={() => onResetPressed!()}>
                <span className="material-symbols-rounded">restart_alt</span>
              </Button>
              <Button variant="text" onClick={() => onDeletePressed!()}>
                <span className="material-symbols-rounded">delete</span>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className="w-14 h-14 border-black border-solid border"
              style={{ backgroundColor: initialColor }}
              onClick={() => setOpen(true)}
            />
            <Typography>Background color</Typography>
          </>
        )}

        {open && (
          <ChromePicker
            className="absolute right-0 z-20"
            onChange={(color) => {
              setCurrentColor(color.hex);
              onColorSelected(color.hex);
            }}
            color={currentColor}
          />
        )}
      </div>
      {open && (
        <div
          className="absolute top-0 bottom-0 left-0 right-0 "
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
