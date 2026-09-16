import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/Dialog.jsx";
import { Button } from "../ui/Button.jsx";
import { Play, Pause } from "lucide-react";

/**
 * Clean Pause Dialog
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onResume
 */
export default function GamePauseModal({ isOpen, onResume }) {
  return (
    <Dialog open={isOpen} onOpenChange={onResume}>
      <DialogContent className="border-[#364152] bg-[#12151a] p-5 shadow-2xl max-w-sm rounded">
        <DialogHeader className="items-center text-center">
          <div className="w-10 h-10 rounded bg-[#181c23] text-[#f59e0b] border border-[#232934] flex items-center justify-center mb-1">
            <Pause className="w-5 h-5" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94a3b8]">
            LOOP SUSPENDED
          </span>
          <DialogTitle className="text-lg font-bold font-display text-[#f8fafc]">
            Session Halted
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8] text-xs">
            Simulation clock suspended. Press [Space] or click below to resume.
          </DialogDescription>
        </DialogHeader>

        <Button
          onClick={onResume}
          size="default"
          className="w-full gap-2 mt-2 font-mono uppercase"
        >
          <Play className="w-4 h-4 fill-current" /> RESUME RUN [SPACE]
        </Button>
      </DialogContent>
    </Dialog>
  );
}
