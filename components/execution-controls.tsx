"use client";

import { Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExecutionControlsProps {
  onRun: () => void;
  onClear: () => void;
}

export function ExecutionControls({ onRun, onClear }: ExecutionControlsProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        onClick={onClear}
        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
      >
        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="hidden sm:inline">Clear</span>
      </button>
      <button
        onClick={onRun}
        className={cn(
          "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all",
          "bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
        )}
      >
        <Play size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
        <span>Run</span>
      </button>
    </div>
  );
}
