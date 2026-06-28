-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "SSLevel" AS ENUM ('SS1', 'SS2', 'SS3');

-- CreateEnum
CREATE TYPE "AcademicStream" AS ENUM ('SCIENCE', 'HUMANITIES', 'BUSINESS');

-- CreateEnum
CREATE TYPE "RiasecType" AS ENUM ('R', 'I', 'A', 'S', 'E', 'C');

-- CreateEnum
CREATE TYPE "PersonalityTrait" AS ENUM ('O', 'C', 'E', 'A', 'N');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'COUNSELOR', 'SCHOOL_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "AcademicLevel" AS ENUM ('JSS3', 'SS1');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('ENGLISH_LANGUAGE', 'MATHEMATICS', 'CITIZENSHIP_AND_HERITAGE', 'DIGITAL_TECHNOLOGIES', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'FURTHER_MATHEMATICS', 'AGRICULTURAL_SCIENCE', 'ANIMAL_HUSBANDRY', 'TECHNICAL_DRAWING', 'FOOD_AND_NUTRITION', 'HOME_MANAGEMENT', 'LITERATURE_IN_ENGLISH', 'GOVERNMENT', 'HISTORY', 'GEOGRAPHY', 'CHRISTIAN_RELIGIOUS_STUDIES', 'ISLAMIC_RELIGIOUS_STUDIES', 'FRENCH', 'YORUBA', 'IGBO', 'HAUSA', 'ARABIC', 'VISUAL_ARTS', 'MUSIC', 'SOCIAL_STUDIES', 'ECONOMICS', 'COMMERCE', 'FINANCIAL_ACCOUNTING', 'BOOK_KEEPING', 'MARKETING', 'OFFICE_PRACTICE', 'STORE_MANAGEMENT', 'DATA_PROCESSING', 'BUSINESS_STUDIES', 'TRADE_WOODWORK', 'TRADE_METALWORK', 'TRADE_ELECTRONICS', 'TRADE_AUTO_MECHANICS', 'TRADE_COSMETOLOGY', 'TRADE_CATERING_CRAFT', 'TRADE_GARMENT_MAKING', 'TRADE_PLUMBING', 'TRADE_BUILDING_CONSTRUCTION', 'TRADE_COMPUTER_CRAFT', 'BASIC_SCIENCE', 'CIVIC_EDUCATION', 'COMPUTER_STUDIES');

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT,
    "lga" TEXT,
    "schoolType" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNSPECIFIED',
    "dateOfBirth" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "ssLevel" "SSLevel" NOT NULL DEFAULT 'SS2',
    "phoneNumber" TEXT,
    "schoolId" TEXT,
    "counselorId" TEXT,
    "careerAspiration" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "counselors" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "qualification" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'COUNSELOR',
    "schoolId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counselors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_profiles" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "jss3Average" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ss1Average" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weightedAcademicScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tradeSubjectChosen" "Subject",
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_scores" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subject" "Subject" NOT NULL,
    "level" "AcademicLevel" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riasec_profiles" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "rScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "iScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "eScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "summaryCode" TEXT NOT NULL DEFAULT '',
    "scienceAffinity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "humanitiesAffinity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "businessAffinity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riasec_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riasec_responses" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "type" "RiasecType" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riasec_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personality_profiles" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "opennessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conscientiousnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extraversionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "agreeablenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "neuroticismScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personality_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bfi_responses" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "trait" "PersonalityTrait" NOT NULL,
    "reverseKeyed" BOOLEAN NOT NULL DEFAULT false,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bfi_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_logs" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "topStream" "AcademicStream" NOT NULL,
    "vScience" DOUBLE PRECISION NOT NULL,
    "vHumanities" DOUBLE PRECISION NOT NULL,
    "vBusiness" DOUBLE PRECISION NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL,
    "guidanceInsight" TEXT NOT NULL,
    "ahpWeightsSnapshot" JSONB NOT NULL,
    "inputsSnapshot" JSONB NOT NULL,
    "algorithmVersion" TEXT NOT NULL DEFAULT 'ahp-saw-v1.0',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jamb_courses" (
    "id" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "facultyArea" TEXT NOT NULL,
    "streamCategory" "AcademicStream" NOT NULL,
    "utmeCutoffHint" INTEGER,
    "description" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jamb_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jamb_course_subjects" (
    "id" TEXT NOT NULL,
    "jambCourseId" TEXT NOT NULL,
    "subject" "Subject" NOT NULL,

    CONSTRAINT "jamb_course_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jamb_validations" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "jambCourseId" TEXT NOT NULL,
    "recommendedStream" "AcademicStream" NOT NULL,
    "isCompliant" BOOLEAN NOT NULL,
    "missingSubjects" "Subject"[],
    "validationNotes" TEXT,
    "validatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jamb_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "studentId" TEXT,
    "actorId" TEXT,
    "actorRole" "UserRole",
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schools_state_idx" ON "schools"("state");

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_state_key" ON "schools"("name", "state");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_schoolId_idx" ON "students"("schoolId");

-- CreateIndex
CREATE INDEX "students_counselorId_idx" ON "students"("counselorId");

-- CreateIndex
CREATE INDEX "students_email_idx" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "counselors_email_key" ON "counselors"("email");

-- CreateIndex
CREATE INDEX "counselors_schoolId_idx" ON "counselors"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "academic_profiles_studentId_key" ON "academic_profiles"("studentId");

-- CreateIndex
CREATE INDEX "subject_scores_studentId_idx" ON "subject_scores"("studentId");

-- CreateIndex
CREATE INDEX "subject_scores_subject_idx" ON "subject_scores"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "subject_scores_studentId_subject_level_key" ON "subject_scores"("studentId", "subject", "level");

-- CreateIndex
CREATE UNIQUE INDEX "riasec_profiles_studentId_key" ON "riasec_profiles"("studentId");

-- CreateIndex
CREATE INDEX "riasec_responses_studentId_idx" ON "riasec_responses"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "riasec_responses_studentId_questionId_key" ON "riasec_responses"("studentId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "personality_profiles_studentId_key" ON "personality_profiles"("studentId");

-- CreateIndex
CREATE INDEX "bfi_responses_studentId_idx" ON "bfi_responses"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "bfi_responses_studentId_questionId_key" ON "bfi_responses"("studentId", "questionId");

-- CreateIndex
CREATE INDEX "recommendation_logs_studentId_idx" ON "recommendation_logs"("studentId");

-- CreateIndex
CREATE INDEX "recommendation_logs_generatedAt_idx" ON "recommendation_logs"("generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "jamb_courses_courseName_key" ON "jamb_courses"("courseName");

-- CreateIndex
CREATE INDEX "jamb_courses_streamCategory_idx" ON "jamb_courses"("streamCategory");

-- CreateIndex
CREATE INDEX "jamb_courses_facultyArea_idx" ON "jamb_courses"("facultyArea");

-- CreateIndex
CREATE INDEX "jamb_course_subjects_jambCourseId_idx" ON "jamb_course_subjects"("jambCourseId");

-- CreateIndex
CREATE UNIQUE INDEX "jamb_course_subjects_jambCourseId_subject_key" ON "jamb_course_subjects"("jambCourseId", "subject");

-- CreateIndex
CREATE INDEX "jamb_validations_studentId_idx" ON "jamb_validations"("studentId");

-- CreateIndex
CREATE INDEX "jamb_validations_jambCourseId_idx" ON "jamb_validations"("jambCourseId");

-- CreateIndex
CREATE INDEX "audit_logs_studentId_idx" ON "audit_logs"("studentId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "counselors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "counselors" ADD CONSTRAINT "counselors_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_profiles" ADD CONSTRAINT "academic_profiles_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_scores" ADD CONSTRAINT "subject_scores_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riasec_profiles" ADD CONSTRAINT "riasec_profiles_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riasec_responses" ADD CONSTRAINT "riasec_responses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personality_profiles" ADD CONSTRAINT "personality_profiles_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bfi_responses" ADD CONSTRAINT "bfi_responses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_logs" ADD CONSTRAINT "recommendation_logs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamb_course_subjects" ADD CONSTRAINT "jamb_course_subjects_jambCourseId_fkey" FOREIGN KEY ("jambCourseId") REFERENCES "jamb_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamb_validations" ADD CONSTRAINT "jamb_validations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jamb_validations" ADD CONSTRAINT "jamb_validations_jambCourseId_fkey" FOREIGN KEY ("jambCourseId") REFERENCES "jamb_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
