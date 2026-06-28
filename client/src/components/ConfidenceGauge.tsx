import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ConfidenceGaugeProps {
  value: number;
}

export default function ConfidenceGauge({ value }: ConfidenceGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const isHigh = clamped >= 80;
  const isMid = clamped >= 65;

  const color = isHigh ? "text-emerald-600" : isMid ? "text-amber-500" : "text-red-500";
  const bgColor = isHigh
    ? "bg-emerald-50 border-emerald-200"
    : isMid
      ? "bg-amber-50 border-amber-200"
      : "bg-red-50 border-red-200";
  const strokeColor = isHigh ? "#10B981" : isMid ? "#F59E0B" : "#EF4444";
  const textFill = isHigh ? "#059669" : isMid ? "#D97706" : "#DC2626";
  const label = isHigh ? "High Confidence" : isMid ? "Moderate Confidence" : "Low Confidence";
  const Icon = isHigh ? TrendingUp : isMid ? Minus : TrendingDown;

  // SVG arc gauge — half-circle
  const r = 54;
  const cx = 70;
  const cy = 70;
  const arcLen = Math.PI * r;
  const filled = (clamped / 100) * arcLen;
  const dashArr = `${filled} ${arcLen}`;

  return (
    <div
      className={`card border-2 ${bgColor} flex flex-col items-center`}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Confidence Level: ${clamped.toFixed(1)}% — ${label}`}
    >
      <p className="text-sm font-semibold text-gray-600 mb-2">Confidence Level</p>
      <svg viewBox="0 0 140 80" className="w-44 h-24" aria-hidden="true">
        {/* Background arc */}
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={dashArr}
          strokeDashoffset="0"
        />
        {/* Value text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="22"
          fontWeight="900"
          fill={textFill}
        >
          {clamped.toFixed(1)}%
        </text>
      </svg>
      <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${color}`}>
        <Icon size={14} />
        {label}
      </span>
    </div>
  );
}