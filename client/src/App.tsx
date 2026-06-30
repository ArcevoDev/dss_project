import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Scores from "./pages/Scores";
import RIASEC from "./pages/RIASEC";
import Personality from "./pages/Personality";
import Results from "./pages/Results";

/** Redirect authenticated users away from public-only routes (login / register). */
function PublicRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? <Navigate to="/scores" replace /> : <>{children}</>;
}

/** Redirect unauthenticated users to login. */
function PrivateRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/scores"
            element={
              <PrivateRoute>
                <Scores />
              </PrivateRoute>
            }
          />
          <Route
            path="/riasec.js"
            element={
              <PrivateRoute>
                <RIASEC />
              </PrivateRoute>
            }
          />
          <Route
            path="/personality"
            element={
              <PrivateRoute>
                <Personality />
              </PrivateRoute>
            }
          />
          <Route
            path="/results"
            element={
              <PrivateRoute>
                <Results />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}