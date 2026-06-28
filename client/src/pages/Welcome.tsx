import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  ClipboardList,
  Brain,
  Smile,
  Trophy,
  FlaskConical,
  BookOpen,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

interface StepInfo {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

interface StatInfo {
  value: string;
  label: string;
}

interface StreamInfo {
  name: string;
  Icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  subjects: string;
  careers: string;
}

const STEPS: StepInfo[] = [
  { Icon: ClipboardList, title: "Enter Your Scores", desc: "Provide your JSS3 and SS1 academic subject scores." },
  { Icon: Brain, title: "Complete Interest Quiz", desc: "48-item RIASEC assessment maps your personality to a career type." },
  { Icon: Smile, title: "Take the Personality Quiz", desc: "20-item BFI assessment captures your core personality traits." },
  { Icon: Trophy, title: "Get Your Recommendation", desc: "The AHP-SAW engine ranks Science, Humanities, and Business for you." },
];

const STATS: StatInfo[] = [
  { value: "78.9%", label: "UTME candidates scored below 200 in 2025 (JAMB)" },
  { value: "1:500+", label: "Counsellor-to-student ratio in Nigerian public schools" },
  { value: "6M+", label: "Candidates blocked by wrong subject combinations (2020–2024)" },
];

const STREAMS: StreamInfo[] = [
  {
    name: "Science",
    Icon: FlaskConical,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-100",
    subjects: "Biology, Chemistry, Physics, Mathematics",
    careers: "Medicine, Engineering, Pharmacy, Computer Science",
  },
  {
    name: "Humanities",
    Icon: BookOpen,
    colorClass: "text-purple-600",
    bgClass: "bg-purple-100",
    subjects: "Literature, Government, History, CRS/IRS",
    careers: "Law, Journalism, Education, Political Science",
  },
  {
    name: "Business",
    Icon: TrendingUp,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-100",
    subjects: "Economics, Commerce, Accounting",
    careers: "Banking, Business Admin, Marketing, Economics",
  },
];

const STAT_ICONS = [AlertTriangle, Users, BarChart3];

export default function Welcome() {
  const { token } = useAuth();

  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Powered by AHP-SAW Decision Engine
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            Find the Right Academic Stream
            <br />
            <span className="text-blue-200">Before It's Too Late</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            A data-driven Decision Support System for Nigerian SS2 students — aligned with the 2025
            NERDC curriculum and JAMB subject requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {token ? (
              <Link
                to="/scores"
                className="btn-primary bg-white text-brand-600 hover:bg-white/90 inline-flex items-center justify-center gap-2"
              >
                Continue My Assessment
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary bg-white text-brand-600 hover:bg-white/90 inline-flex items-center justify-center gap-2"
                >
                  Start Free Assessment
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary bg-white/10 border-white/40 text-white hover:bg-white/5"
                >
                  I Have an Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-500 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {STATS.map((s, i) => {
            const StatIcon = STAT_ICONS[i]!;
            return (
              <div key={i} className="text-white">
                <StatIcon size={20} className="text-blue-200 mx-auto mb-2 opacity-80" />
                <p className="text-3xl font-black text-blue-200">{s.value}</p>
                <p className="text-xs text-white/70 mt-1 max-w-[200px] mx-auto">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => {
              const { Icon } = s;
              return (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 mb-4">
                    <Icon size={26} />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="step-badge">{i + 1}</span>
                    <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Streams */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center text-gray-900 mb-4">
            2025 NERDC Academic Streams
          </h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            All recommendations are aligned with the revised Nigerian curriculum
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {STREAMS.map((s) => {
              const { Icon } = s;
              return (
                <div key={s.name} className="card hover:shadow-md transition-all">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${s.bgClass} mb-3`}>
                    <Icon size={20} className={s.colorClass} />
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2">{s.name} Stream</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    <strong>Subjects:</strong> {s.subjects}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Careers:</strong> {s.careers}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-600 text-white/60 text-xs text-center py-6">
        <p>DSS — Weighted Decision Support System for Nigerian SS2 Students</p>
        <p className="mt-1">AHP-SAW Engine · RIASEC · BFI-20 · 2025 NERDC Curriculum Aligned</p>
      </footer>
    </div>
  );
}