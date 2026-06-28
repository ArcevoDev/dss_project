import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api";
import ProgressBar from "@/components/ProgressBar";
import { getApiErrorMessage } from "@/api/errors";
import type { BfiQuestion, BfiTrait } from "@/types/index";
import { Smile, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LikertOption {
  value: number;
  label: string;
}

const LIKERT: LikertOption[] = [
  { value: 1, label: "Disagree Strongly" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Agree Strongly" },
];

const TRAIT_COLORS: Record<BfiTrait, string> = {
  O: "bg-indigo-100 text-indigo-700 border-indigo-200",
  C: "bg-cyan-100 text-cyan-700 border-cyan-200",
  E: "bg-rose-100 text-rose-700 border-rose-200",
  A: "bg-lime-100 text-lime-700 border-lime-200",
  N: "bg-slate-100 text-slate-700 border-slate-200",
};

const TRAIT_NAMES: Record<BfiTrait, string> = {
  O: "Openness",
  C: "Conscientiousness",
  E: "Extraversion",
  A: "Agreeableness",
  N: "Neuroticism",
};

export default function Personality() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<BfiQuestion[]>([]);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get<{ questions: BfiQuestion[] }>("/bfi/questions")
      .then(({ data }) => {
        setQuestions(data.questions);
        setFetching(false);
      })
      .catch(() => {
        setError("Failed to load questions. Please refresh.");
        setFetching(false);
      });
  }, []);

  const totalAnswered = Object.keys(responses).length;
  // Dynamic — not hardcoded to 20, so a BFI-44 swap works automatically
  const allAnswered = totalAnswered === questions.length && questions.length > 0;

  function handleRate(questionId: number, value: number): void {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setError("");
  }

  async function handleSubmit(): Promise<void> {
    if (!allAnswered) {
      setError(`Please answer all ${questions.length} questions before continuing.`);
      return;
    }
    setLoading(true);
    try {
      const orderedResponses = [...questions]
        .sort((a, b) => a.id - b.id)
        .map((q) => responses[q.id]!);
      await api.post("/bfi/submit", { responses: orderedResponses });
      toast.success("Personality profile saved!", {
        description: "Generating your personalised recommendation now…",
      });
      navigate("/results");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Submission failed. Please try again.");
      setError(msg);
      toast.error("Submission failed", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="text-brand-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading assessment questions…</p>
        </div>
      </div>
    );
  }

  // Group questions by trait for cleaner visual grouping
  const traits = (["O", "C", "E", "A", "N"] as BfiTrait[]).filter((t) =>
    questions.some((q) => q.trait === t)
  );

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressBar step={3} total={4} labels={["Scores", "Interests", "Personality", "Results"]} />

        <div className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="step-badge">
                  <Smile size={14} />
                </span>
                <div>
                  <h2 className="font-black text-gray-900 text-lg">
                    Personality Assessment (BFI-{questions.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Rate how well each statement describes you · {totalAnswered}/{questions.length}{" "}
                    answered
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {traits.map((trait) => {
                  const traitQs = questions.filter((q) => q.trait === trait);
                  return (
                    <div key={trait}>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold mb-4 ${TRAIT_COLORS[trait]}`}
                      >
                        {TRAIT_NAMES[trait]}
                      </div>

                      <div className="space-y-4">
                        {traitQs.map((q) => (
                          <div
                            key={q.id}
                            className={`p-4 rounded-xl border transition-all ${
                              responses[q.id] !== undefined
                                ? "border-brand-200 bg-brand-50/40"
                                : "border-gray-100 bg-white"
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-800 mb-3">
                              <span className="text-gray-400 text-xs mr-2">Q{q.id}.</span>
                              {q.text}
                              {q.reverseKeyed && (
                                <span className="ml-2 text-[10px] text-gray-400 font-normal italic">
                                  (reversed)
                                </span>
                              )}
                            </p>
                            <div className="flex gap-1.5 flex-wrap">
                              {LIKERT.map((l) => (
                                <button
                                  key={l.value}
                                  type="button"
                                  onClick={() => handleRate(q.id, l.value)}
                                  className={`flex-1 min-w-[56px] py-2 px-1 rounded-lg text-xs font-medium border transition-all ${
                                    responses[q.id] === l.value
                                      ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                                      : "bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:bg-brand-50"
                                  }`}
                                >
                                  {l.value}
                                  <span className="block text-[10px] leading-tight mt-0.5 opacity-70">
                                    {l.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="button"
                className="w-full mt-6"
                onClick={handleSubmit}
                disabled={loading || !allAnswered}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Calculating…
                  </>
                ) : (
                  <>
                    Submit & See My Results
                    <ArrowRight size={15} />
                  </>
                )}
              </Button>

              {!allAnswered && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  {questions.length - totalAnswered} question
                  {questions.length - totalAnswered !== 1 ? "s" : ""} remaining
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}