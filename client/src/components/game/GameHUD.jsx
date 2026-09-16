import { Button } from "../ui/Button.jsx";
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sliders,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/Tooltip.jsx";
import { GAME_STATUS } from "../../engine/Constants.js";

/**
 * Compact Game HUD displaying Score, Personal Best, Speed Level, and Toolbar controls.
 *
 * @param {Object} props
 * @param {number} props.score
 * @param {number|string} props.personalBest
 * @param {number} props.speedLevel
 * @param {import('../../engine/Types').GameStatus} props.status
 * @param {boolean} props.isMuted
 * @param {() => void} props.onToggleMute
 * @param {() => void} props.onTogglePause
 * @param {() => void} [props.onReset]
 * @param {() => void} [props.onOpenSettings]
 */
export default function GameHUD({
  score,
  personalBest,
  speedLevel,
  status,
  isMuted,
  onToggleMute,
  onTogglePause,
  onReset,
  onOpenSettings,
}) {
  const isPaused = status === GAME_STATUS.PAUSED;
  const isPlaying = status === GAME_STATUS.RUNNING;

  return (
    <TooltipProvider delayDuration={150}>
      <header className="w-full bg-slate-900/90 rounded-xl border border-slate-700/80 p-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Telemetry Pods Cluster */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            {/* Pod 1: System State */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPlaying
                    ? "bg-emerald-400 shadow-md shadow-emerald-400/50 animate-pulse"
                    : isPaused
                    ? "bg-amber-400 shadow-md shadow-amber-400/50"
                    : "bg-slate-500"
                }`}
              />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  STATE
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase">
                  {status === GAME_STATUS.RUNNING
                    ? "LIVE RUN"
                    : status === GAME_STATUS.PAUSED
                    ? "HALTED"
                    : status === GAME_STATUS.GAMEOVER
                    ? "TERMINATED"
                    : "STANDBY"}
                </span>
              </div>
            </div>

            <div className="w-px h-6 bg-slate-700/80 hidden sm:block" />

            {/* Pod 2: Current Score */}
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                CURRENT RUN
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-xl font-bold tracking-tight text-white">
                  {score.toLocaleString()}
                </span>
                <span className="font-mono text-[9px] text-slate-400">PTS</span>
              </div>
            </div>

            <div className="w-px h-6 bg-slate-700/80 hidden sm:block" />

            {/* Pod 3: Personal Best */}
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                PERSONAL BEST
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-xl font-bold tracking-tight text-amber-400">
                  {typeof personalBest === "number"
                    ? personalBest.toLocaleString()
                    : personalBest}
                </span>
                <span className="font-mono text-[9px] text-slate-400">HIGH</span>
              </div>
            </div>

            <div className="w-px h-6 bg-slate-700/80 hidden sm:block" />

            {/* Pod 4: Speed Ramp Multiplier */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                  SPEED RAMP
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {speedLevel}x
                </span>
              </div>
              {/* 5-Step Segmented Bar */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((tier) => (
                  <div
                    key={tier}
                    className={`w-3.5 h-1.5 rounded-[2px] transition-colors ${
                      speedLevel >= tier ? "bg-emerald-400 shadow-sm" : "bg-slate-800 border border-slate-700/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-1.5 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#232934]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTogglePause}
                  aria-label={isPaused ? "Resume run" : "Pause run"}
                  className="h-8 px-2 text-xs font-mono"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="hidden sm:inline">Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Pause</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pause / Resume [Space]</TooltipContent>
            </Tooltip>

            {onReset && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    aria-label="Restart run"
                    className="h-8 px-2 text-xs font-mono"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restart [R]</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleMute}
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  className="h-8 w-8 text-[#94a3b8] hover:text-[#f8fafc]"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#ef4444]" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isMuted ? "Unmute Sound" : "Mute Sound"}
              </TooltipContent>
            </Tooltip>

            {onOpenSettings && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenSettings}
                    aria-label="Preferences"
                    className="h-8 w-8 text-[#94a3b8] hover:text-[#f8fafc]"
                  >
                    <Sliders className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Audio & Controls</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
