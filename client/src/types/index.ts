// ============================================================================
// Shared client-side types, mirroring the server's API response/request
// shapes. Kept independent of the server package (no cross-package import).
// ============================================================================

export type Stream = "Science" | "Humanities" | "Business";

export type Gender = "MALE" | "FEMALE" | "UNSPECIFIED";

export interface AuthStudent {
  id: string;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  student: AuthStudent;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  gender?: Gender;
  schoolName?: string;
  dateOfBirth?: string;
}

export type RiasecLetter = "R" | "I" | "A" | "S" | "E" | "C";

export interface RiasecQuestion {
  id: number;
  type: RiasecLetter;
  text: string;
}

export type BfiTrait = "O" | "C" | "E" | "A" | "N";

export interface BfiQuestion {
  id: number;
  trait: BfiTrait;
  text: string;
  reverseKeyed: boolean;
}

// FR-02: normalized payload sent to POST /profile/scores
export interface SubjectScoreEntry {
  subject: string;          // Subject enum value e.g. "ENGLISH_LANGUAGE"
  level: "JSS3" | "SS1";
  score: number;
}

export interface AcademicScoresPayload {
  scores: SubjectScoreEntry[];
  tradeSubjectChosen?: string;
}

export interface StreamScore {
  stream: Stream;
  score: number;
}

export interface AhpWeightsResult {
  weights: [number, number, number];
  lambda: number;
  ci: number;
  cr: number;
  consistent: boolean;
  labels: [string, string, string];
}

export interface RecommendationResult {
  ranked: StreamScore[];
  topStream: Stream;
  vScience: number;
  vHumanities: number;
  vBusiness: number;
  confidenceLevel: number;
  guidanceInsight: string;
  ahpWeights: AhpWeightsResult;
  personalitySource: "assessed" | "default";
  logId: string;
}

// JambCourse returned by GET /jamb/catalog
export interface JambCourseSubjectRow {
  subject: string;  // Subject enum value
}

export interface JambCourse {
  id: string;
  courseName: string;
  facultyArea: string;
  streamCategory: "SCIENCE" | "HUMANITIES" | "BUSINESS";
  description: string;
  mandatorySubjects: JambCourseSubjectRow[];
}

/**
 * Successful JAMB validation response from POST /jamb/validate.
 * FIX (Bug 2.9): extracted into a discriminated union so the error-path
 * synthetic object is typed accurately without lying about required fields.
 */
export interface JambValidationSuccess {
  error?: never;
  course: string;
  stream: string;
  mandatorySubjects: string[];
  studentSubjects: string[];
  compliant: boolean;
  missingSubjects: string[];
  message: string;
}

export interface JambValidationError {
  error: string;
  course?: string;
  stream?: string;
  mandatorySubjects?: string[];
  studentSubjects?: string[];
  compliant?: boolean;
  missingSubjects?: string[];
  message?: string;
}

/** Discriminated union — prefer checking `.error` first. */
export type JambValidationResult = JambValidationSuccess | JambValidationError;

export interface ApiErrorResponse {
  error: string;
  details?: { path: string; message: string }[];
}