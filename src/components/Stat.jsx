import { Info } from "lucide-react";
import Label from "./Label";

export default function Stat({ label, value, hint }) {
  return (
    <div className="bg-white/60 dark:bg-neutral-900/60 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {hint && (
          <span className="tooltip tooltip-left" data-tip={hint}>
            <Info className="w-3.5 h-3.5 text-gray-400" />
          </span>
        )}
      </div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}