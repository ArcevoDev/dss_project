import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "./ui/progress";

interface ProgressBarProps {
  step: number;
  total?: number;
  labels?: string[];
}

export default function ProgressBar({ step, total = 4, labels = [] }: ProgressBarProps) {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="w-full">
      {/* Numeric summary */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>
          Step {step} of {total}
        </span>
        <span>{pct}% complete</span>
      </div>

      {/* shadcn Progress track */}
      <Progress value={pct} />

      {/* Step indicators */}
      {labels.length > 0 && (
        <div className="flex justify-between mt-3">
          {labels.map((l, i) => {
            const stepNum = i + 1;
            const done = stepNum < step;
            const active = stepNum === step;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 min-w-0">
                {done ? (
                  <CheckCircle2 size={14} className="text-brand-500 shrink-0" />
                ) : (
                  <Circle
                    size={14}
                    className={`shrink-0 ${active ? "text-brand-500" : "text-gray-300"}`}
                  />
                )}
                <span
                  className={`text-[10px] font-medium text-center leading-tight ${
                    active ? "text-brand-500" : done ? "text-gray-500" : "text-gray-300"
                  }`}
                >
                  {l}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}