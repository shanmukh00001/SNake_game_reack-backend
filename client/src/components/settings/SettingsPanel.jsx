import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../ui/Dialog.jsx";
import { Switch } from "../ui/Switch.jsx";
import { Slider } from "../ui/Slider.jsx";
import { audioEngine } from "../../engine/AudioEngine.js";
import { Volume2, Sliders, Keyboard } from "lucide-react";

/**
 * Settings and Preferences Panel
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 */
export default function SettingsPanel({ isOpen, onClose }) {
  const [isMuted, setIsMuted] = useState(() => audioEngine.isMuted());
  const [volume, setVolume] = useState(50);

  const handleMuteToggle = (checked) => {
    const newMuted = !checked;
    if (newMuted !== audioEngine.isMuted()) {
      audioEngine.toggleMute();
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (values) => {
    const newVol = values[0];
    setVolume(newVol);
    audioEngine.setVolume(newVol / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-[#364152] bg-[#12151a] p-5 shadow-2xl max-w-sm rounded">
        <DialogHeader className="items-center text-center">
          <div className="w-10 h-10 rounded bg-[#181c23] border border-[#232934] flex items-center justify-center mb-1 text-[#10b981]">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#94a3b8]">
            OPERATOR SETTINGS
          </span>
          <DialogTitle className="text-lg font-bold font-display text-[#f8fafc]">
            Preferences & Telemetry
          </DialogTitle>
          <DialogDescription className="text-[#94a3b8] text-xs">
            Tune runtime audio synthesis and mechanical controls.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm">
          {/* Audio Enable Switch */}
          <div className="flex items-center justify-between p-3 rounded bg-[#181c23] border border-[#232934]">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-[#10b981]" />
              <div className="flex flex-col">
                <span className="font-semibold text-[#f8fafc] text-xs">
                  Sound Synthesis
                </span>
                <span className="text-[10px] text-[#94a3b8] font-mono">
                  Web Audio pure oscillator
                </span>
              </div>
            </div>
            <Switch checked={!isMuted} onCheckedChange={handleMuteToggle} />
          </div>

          {/* Volume Slider */}
          <div className="p-3 rounded bg-[#181c23] border border-[#232934] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#f8fafc]">
              <span>Master Output</span>
              <span className="font-mono text-[#10b981]">{volume}%</span>
            </div>
            <Slider
              value={[volume]}
              max={100}
              step={5}
              onValueChange={handleVolumeChange}
              disabled={isMuted}
            />
          </div>

          {/* Hotkey Guide */}
          <div className="p-3 rounded bg-[#181c23] border border-[#232934] space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#f8fafc]">
              <Keyboard className="w-3.5 h-3.5 text-[#94a3b8]" /> Control Matrix
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#94a3b8]">
              <span>
                Steer:{" "}
                <strong className="text-[#f8fafc]">WASD / Arrows</strong>
              </span>
              <span>
                Pause: <strong className="text-[#f8fafc]">[Space]</strong>
              </span>
              <span>
                Reset: <strong className="text-[#f8fafc]">[R]</strong>
              </span>
              <span>
                Audio: <strong className="text-[#f8fafc]">Pure Sine</strong>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
