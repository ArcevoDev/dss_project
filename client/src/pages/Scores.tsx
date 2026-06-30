import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/api";
import ProgressBar from "@/components/ProgressBar";
import { getApiErrorMessage } from "@/api/errors";
import { ClipboardList, ArrowRight, AlertCircle, BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubjectField {
  subject: string;
  level: "JSS3" | "SS1";
  label: string;
  hint: string;
  formKey: string;
}

const SUBJECT_FIELDS: SubjectField[] = [
  {
    subject: "ENGLISH_LANGUAGE",
    level: "JSS3",
    label: "JSS3 Overall Average",
    hint: "Your final JSS3 cumulative average across all subjects (0–100)",
    formKey: "jss3Average",
  },
  {
    subject: "ENGLISH_LANGUAGE",
    level: "SS1",
    label: "SS1 English Language",
    hint: "Your SS1 English Language score (0–100)",
    formKey: "ss1English",
  },
  {
    subject: "MATHEMATICS",
    level: "SS1",
    label: "SS1 Mathematics",
    hint: "Your SS1 Mathematics score (0–100)",
    formKey: "ss1Mathematics",
  },
  {
    subject: "BIOLOGY",
    level: "SS1",
    label: "SS1 Basic Science / Biology",
    hint: "Your SS1 Basic Science or Biology score (0–100)",
    formKey: "ss1BasicScience",
  },
  {
    subject: "SOCIAL_STUDIES",
    level: "SS1",
    label: "SS1 Social Studies",
    hint: "Your SS1 Social Studies score (0–100)",
    formKey: "ss1SocialStudies",
  },
  {
    subject: "BUSINESS_STUDIES",
    level: "SS1",
    label: "SS1 Business Studies",
    hint: "Your SS1 Business Studies score (0–100)",
    formKey: "ss1BusinessStudies",
  },
];

type FormKey = (typeof SUBJECT_FIELDS)[number]["formKey"];
type ScoresForm = Record<FormKey, string>;

const EMPTY_FORM: ScoresForm = Object.fromEntries(
  SUBJECT_FIELDS.map((f) => [f.formKey, ""])
) as ScoresForm;

export default function Scores() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<ScoresForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    if (value !== "" && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) return;
    setScores((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const incomplete = SUBJECT_FIELDS.some((f) => scores[f.formKey] === "");
    if (incomplete) {
      setError("Please fill in all subject scores before continuing.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        scores: SUBJECT_FIELDS.map((f) => ({
          subject: f.subject,
          level: f.level,
          score: parseFloat(scores[f.formKey]!),
        })),
      };
      await api.post("/profile/scores", payload);
      toast.success("Academic scores saved!", {
        description: "Moving on to the Interest Assessment.",
      });
      navigate("/riasec");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to save scores. Please try again.");
      setError(msg);
      toast.error("Save failed", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  // Live weighted preview: (JSS3 avg × 40%) + (SS1 avg × 60%)
  const weighted = (() => {
    const jss3 = parseFloat(scores["jss3Average"] ?? "") || 0;
    const ss1Keys: FormKey[] = [
      "ss1English",
      "ss1Mathematics",
      "ss1BasicScience",
      "ss1SocialStudies",
      "ss1BusinessStudies",
    ];
    const ss1s = ss1Keys.map((k) => parseFloat(scores[k] ?? "") || 0);
    const ss1Avg = ss1s.reduce((a, b) => a + b, 0) / 5;
    return (jss3 * 0.4 + ss1Avg * 0.6).toFixed(1);
  })();

  const filledCount = SUBJECT_FIELDS.filter((f) => scores[f.formKey] !== "").length;
  const weightedNum = parseFloat(weighted);
  const previewColor =
    weightedNum >= 70 ? "text-emerald-600" : weightedNum >= 50 ? "text-amber-500" : "text-brand-600";

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <ProgressBar step={1} total={4} labels={["Scores", "Interests", "Personality", "Results"]} />

        <div className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="step-badge">
                  <ClipboardList size={14} />
                </span>
                <div>
                  <h2 className="font-black text-gray-900 text-lg">Academic Score Entry</h2>
                  <p className="text-xs text-gray-500">
                    Enter your most recent JSS3 average and SS1 subject scores
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">
                  Junior Secondary (JSS3)
                </p>

                {SUBJECT_FIELDS.filter((f) => f.level === "JSS3").map((f) => (
                  <div key={f.formKey}>
                    <Label htmlFor={f.formKey}>{f.label}</Label>
                    <Input
                      id={f.formKey}
                      type="number"
                      name={f.formKey}
                      min={0}
                      max={100}
                      step={0.1}
                      placeholder="0 – 100"
                      value={scores[f.formKey]}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">{f.hint}</p>
                  </div>
                ))}

                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4">
                  Senior Secondary Year 1 (SS1)
                </p>

                {SUBJECT_FIELDS.filter((f) => f.level === "SS1").map((f) => (
                  <div key={f.formKey}>
                    <Label htmlFor={f.formKey}>{f.label}</Label>
                    <Input
                      id={f.formKey}
                      type="number"
                      name={f.formKey}
                      min={0}
                      max={100}
                      step={0.1}
                      placeholder="0 – 100"
                      value={scores[f.formKey]}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">{f.hint}</p>
                  </div>
                ))}

                {/* Live weighted preview */}
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mt-2 flex items-center gap-3">
                  <BarChart3 size={28} className="text-brand-500 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Weighted Academic Score Preview</p>
                    <p className={`text-2xl font-black ${previewColor}`}>
                      {weighted}
                      <span className="text-sm font-normal text-gray-400"> / 100</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      SS1 Average (60%) + JSS3 Average (40%) · {filledCount} of {SUBJECT_FIELDS.length}{" "}
                      filled
                    </p>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      Save & Continue to Interest Quiz
                      <ArrowRight size={15} />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}