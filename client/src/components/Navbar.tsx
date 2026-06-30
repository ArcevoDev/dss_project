import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BookMarked, LogOut, UserCircle2, ChevronRight } from "lucide-react";

interface NavStep {
  path: string;
  label: string;
  step: number;
}

const STEPS: NavStep[] = [
  { path: "/scores", label: "Academic Scores", step: 1 },
  { path: "/riasec", label: "Interest Quiz", step: 2 },
  { path: "/personality", label: "Personality", step: 3 },
  { path: "/results", label: "Results", step: 4 },
];

export default function Navbar() {
  const { token, student, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout(): void {
    logout();
    navigate("/");
  }

  const isAppRoute = STEPS.some((s) => location.pathname.startsWith(s.path));

  return (
    <nav className="bg-brand-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="bg-white text-brand-600 rounded-lg p-1 flex items-center">
            <BookMarked size={16} />
          </span>
          <span className="hidden sm:inline text-white/90">DSS — Career Guide</span>
          <span className="sm:hidden text-white/90">DSS</span>
        </Link>

        {/* Step progress (only on app routes, only on md+) */}
        {token && isAppRoute && (
          <div className="hidden md:flex items-center gap-1">
            {STEPS.map((s, i) => {
              const active = location.pathname.startsWith(s.path);
              return (
                <div key={s.path} className="flex items-center gap-1">
                  <Link
                    to={s.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active ? "bg-white text-brand-600" : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        active ? "bg-brand-600 text-white" : "bg-white/20"
                      }`}
                    >
                      {s.step}
                    </span>
                    {s.label}
                  </Link>
                  {i < STEPS.length - 1 && <ChevronRight size={12} className="text-white/30" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Auth */}
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-white/80">
                <UserCircle2 size={14} />
                <span>
                  Hi, <span className="font-semibold text-white">{student?.fullName?.split(" ")[0]}</span>
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                aria-label="Log out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-white text-brand-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}