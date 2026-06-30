import { FlaskConical, BookOpen, TrendingUp, Star, type LucideIcon } from "lucide-react";
import type { Stream } from "@/types/index.js";

interface StreamMeta {
  color: string;
  Icon: LucideIcon;
  subjects: string;
  bg: string;
  badge: string;
  bar: string;
}

const STREAM_META: Record<Stream, StreamMeta> = {
  Science: {
    color: "blue",
    Icon: FlaskConical,
    subjects: "Biology · Chemistry · Physics",
    bg: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
  },
  Humanities: {
    color: "purple",
    Icon: BookOpen,
    subjects: "Literature · Government · History",
    bg: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    bar: "bg-purple-500",
  },
  Business: {
    color: "emerald",
    Icon: TrendingUp,
    subjects: "Economics · Commerce · Accounting",
    bg: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
  },
};

interface StreamCardProps {
  stream: Stream;
  score: number;
  rank: number;
  maxScore: number;
}

export default function StreamCard({ stream, score, rank, maxScore }: StreamCardProps) {
  const meta = STREAM_META[stream] ?? STREAM_META.Science;
  // FIX (Bug 2.2): pct computed only for inline style — no dead Tailwind dynamic class
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const isTop = rank === 1;
  const { Icon } = meta;

  return (
    <div
      className={`relative border-2 rounded-2xl p-5 transition-all ${
        isTop ? meta.bg + " shadow-md" : "bg-white border-gray-100"
      }`}
    >
      {isTop && (
        <span
          className={`absolute -top-3 left-4 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${meta.badge}`}
        >
          <Star size={10} className="fill-current" />
          Top Recommendation
        </span>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-${meta.color}-100`}>
            <Icon size={18} className={`text-${meta.color}-600`} />
          </span>
          <div>
            <p className="font-bold text-gray-900">{stream} Stream</p>
            <p className="text-xs text-gray-500">{meta.subjects}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-gray-900">{(score * 100).toFixed(1)}</p>
          <p className="text-xs text-gray-400">SAW score ×100</p>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        {/* inline style used intentionally — dynamic % widths require style, not Tailwind JIT */}
        <div
          className={`${meta.bar} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-400 mt-1">Rank #{rank}</p>
    </div>
  );
}