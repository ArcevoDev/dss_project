import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/api/errors";
import type { Gender } from "@/types/index";
import { User, Mail, Lock, Calendar, School, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: "" | Gender;
  schoolName: string;
  dateOfBirth: string;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    schoolName: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        gender: (form.gender as Gender) || undefined,
        // FIX (Bug 2.1): schoolName now accepted by server registerSchema
        schoolName: form.schoolName || undefined,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
      });
      navigate("/scores");
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Start your subject combination assessment</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Personal details</CardTitle>
            <CardDescription>All fields except school name are required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Full Name */}
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <Input
                    id="fullName"
                    className="pl-9"
                    name="fullName"
                    placeholder="e.g. Amara Okonkwo"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="reg-email">Email Address</Label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <Input
                    id="reg-email"
                    className="pl-9"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password pair */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <Input
                      id="password"
                      className="pl-9"
                      type="password"
                      name="password"
                      placeholder="Min. 8 chars"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <Input
                      id="confirmPassword"
                      className="pl-9"
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              {/* Gender + DOB */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select id="gender" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select…</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNSPECIFIED">Prefer not to say</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <Input
                      id="dateOfBirth"
                      className="pl-9"
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      autoComplete="bday"
                    />
                  </div>
                </div>
              </div>

              {/* School Name */}
              <div>
                <Label htmlFor="schoolName">
                  School Name{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <div className="relative">
                  <School
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <Input
                    id="schoolName"
                    className="pl-9"
                    name="schoolName"
                    placeholder="e.g. Government Secondary School, Lagos"
                    value={form.schoolName}
                    onChange={handleChange}
                    autoComplete="organization"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Account & Start
                    <ArrowRight size={15} />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-500 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}