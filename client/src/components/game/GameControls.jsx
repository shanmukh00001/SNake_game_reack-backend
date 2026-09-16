import { Button } from "../ui/Button.jsx";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Responsive On-Screen D-Pad for mobile and touch devices.
 *
 * @param {Object} props
 * @param {(dir: import('../../engine/Types').Direction) => void} props.onDirection
 */
export default function GameControls({ onDirection }) {
  return (
    <div
      className="grid grid-cols-3 gap-1.5 w-[180px] mt-3 sm:hidden select-none"
      aria-label="Touch Direction Controls"
    >
      <div />
      <Button
        variant="dpad"
        className="h-11 w-full rounded"
        onClick={() => onDirection("UP")}
        aria-label="Move Up"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
      <div />

      <Button
        variant="dpad"
        className="h-11 w-full rounded"
        onClick={() => onDirection("LEFT")}
        aria-label="Move Left"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <Button
        variant="dpad"
        className="h-11 w-full rounded"
        onClick={() => onDirection("DOWN")}
        aria-label="Move Down"
      >
        <ArrowDown className="w-5 h-5" />
      </Button>

      <Button
        variant="dpad"
        className="h-11 w-full rounded"
        onClick={() => onDirection("RIGHT")}
        aria-label="Move Right"
      >
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
