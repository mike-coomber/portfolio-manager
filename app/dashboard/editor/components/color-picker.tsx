import { Typography, collapse } from "@material-tailwind/react";
import { useState } from "react";
import { ChromePicker } from "react-color";

export function ColorPicker({
  onColorSelected,
  initialColor,
}: {
  onColorSelected: (color: string) => void;
  initialColor: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor ?? "white");

  return (
    <>
      <div className="flex flex-col relative items-center justify-center">
        <div
          className="w-14 h-14 border-black border-solid border"
          style={{ backgroundColor: initialColor }}
          onClick={() => setOpen(true)}
        />
        <Typography>Background color</Typography>
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
