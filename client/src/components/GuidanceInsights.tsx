import { Lightbulb } from "lucide-react";

interface GuidanceInsightsProps {
  text?: string;
}

export default function GuidanceInsights({ text }: GuidanceInsightsProps) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="card border-l-4 border-brand-500">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-50 text-brand-500">
          <Lightbulb size={16} />
        </span>
        <h3 className="font-bold text-gray-900">Guidance Insights</h3>
      </div>
      <div className="space-y-2">
        {lines.map((line, i) =>
          line.trim() === "" ? (
            <div key={i} className="h-2" />
          ) : (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">
              {line}
            </p>
          )
        )}
      </div>
    </div>
  );
}