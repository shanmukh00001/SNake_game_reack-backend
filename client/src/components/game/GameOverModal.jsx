import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/Dialog.jsx";
import { Button } from "../ui/Button.jsx";
import { Trophy, RefreshCw, Award, Clock } from "lucide-react";

/**
 * Polished Game Over Dialog showing final score, personal best comparison, and stats.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {number} props.score
 * @param {number|string} props.personalBest
 * @param {number} [props.foodEaten=0]
 * @param {number} [props.durationMs=0]
 * @param {boolean} [props.isWon=false]
 * @param {boolean} [props.isGuest=false]
 * @param {string} [props.error]
 * @param {() => void} props.onPlayAgain
 */
export default function GameOverModal({
  isOpen,
  score,
  personalBest,
  foodEaten = 0,
  durationMs = 0,
  isWon = false,
  isGuest = false,
  error,
  onPlayAgain,
}) {
  const isNewRecord =
    typeof personalBest === "number" && score > 0 && score >= personalBest;

  const durationFormatted = `${Math.floor(durationMs / 1000)}s`;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="border-[#364152] bg-[#12151a] p-5 shadow-2xl max-w-sm rounded">
        <DialogHeader className="items-center text-center">
          <div
            className={`w-11 h-11 rounded flex items-center justify-center mb-1 border ${
              isWon
                ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
                : isNewRecord
                ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                : "bg-[#181c23] text-[#ef4444] border-[#ef4444]/30"
            }`}
          >
            {isWon || isNewRecord ? (
              <Trophy className="w-5 h-5" />
            ) : (
              <Award className="w-5 h-5" />
            )}
          </div>

          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94a3b8]">
            {isWon
              ? "CANON COMPLETE"
              : isNewRecord
              ? "RECORD ECLIPSED"
              : "COLLISION DETECTED"}
          </span>

          <DialogTitle className="text-lg font-bold font-display tracking-tight text-[#f8fafc]">
            {isWon
              ? "Sector Cleared"
              : isNewRecord
              ? "New Record Logged"
              : "Run Terminated"}
          </DialogTitle>

          <DialogDescription className="text-[#94a3b8] text-xs max-w-[280px]">
            {isWon
              ? "Maximum grid capacity reached with zero trajectory fault."
              : isNewRecord
              ? "New telemetry benchmark established for this matrix."
              : "Physical boundary or self-segment contact occurred."}
          </DialogDescription>
        </DialogHeader>

        {/* Stats Matrix */}
        <div className="grid grid-cols-2 gap-2 my-2 font-mono">
          <div className="flex flex-col items-center p-2.5 rounded bg-[#181c23] border border-[#232934]">
            <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
              SCORE
            </span>
            <span className="text-xl font-bold text-[#10b981]">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded bg-[#181c23] border border-[#232934]">
            <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
              BEST
            </span>
            <span className="text-xl font-bold text-[#f59e0b]">
              {typeof personalBest === "number"
                ? personalBest.toLocaleString()
                : personalBest}
            </span>
          </div>

          {foodEaten > 0 && (
            <div className="flex flex-col items-center p-2 rounded bg-[#181c23] border border-[#232934]">
              <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
                PELLETS
              </span>
              <span className="text-sm font-bold text-[#f8fafc]">
                {foodEaten}
              </span>
            </div>
          )}

          {durationMs > 0 && (
            <div className="flex flex-col items-center p-2 rounded bg-[#181c23] border border-[#232934]">
              <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
                DURATION
              </span>
              <span className="text-sm font-bold text-[#f8fafc]">
                {durationFormatted}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {isGuest && (
            <div className="p-2 rounded bg-[#181c23] border border-[#232934] text-center">
              <p className="text-[11px] font-mono text-[#94a3b8]">
                Guest telemetry stored locally. Sign in to post to global records.
              </p>
            </div>
          )}

          <Button
            variant="default"
            size="default"
            onClick={onPlayAgain}
            className="w-full gap-2 font-mono uppercase"
          >
            <RefreshCw className="w-4 h-4" /> RETRY RUN [R]
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
