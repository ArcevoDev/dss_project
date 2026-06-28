import type { Request, Response } from "express";
import { prisma } from "@/db/prisma";
import { asyncHandler } from "@/middleware/async-handler";
import { AcademicLevel, type Subject } from "@prisma-client";
import type { AcademicScoresInput } from "@/validators/schemas";

/**
 * Compute the weighted academic score from a set of SubjectScore rows:
 *   weightedAcademicScore = (jss3Average × 0.40) + (ss1Average × 0.60)
 * §3.5.3 Phase 2 normalization.
 */
function computeAggregate(scores: AcademicScoresInput["scores"]): {
  jss3Average: number;
  ss1Average: number;
  weightedAcademicScore: number;
} {
  const jss3Scores = scores.filter((s) => s.level === AcademicLevel.JSS3).map((s) => s.score);
  const ss1Scores = scores.filter((s) => s.level === AcademicLevel.SS1).map((s) => s.score);

  const average = (arr: number[]): number => (arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length);

  const jss3Average = parseFloat(average(jss3Scores).toFixed(2));
  const ss1Average = parseFloat(average(ss1Scores).toFixed(2));
  const weightedAcademicScore = parseFloat((jss3Average * 0.4 + ss1Average * 0.6).toFixed(2));

  return { jss3Average, ss1Average, weightedAcademicScore };
}

export const saveScores = asyncHandler<Request<Record<string, never>, unknown, AcademicScoresInput>>(
  async (req, res: Response) => {
    const studentId = req.student!.id;
    const { scores, tradeSubjectChosen } = req.body;

    const { jss3Average, ss1Average, weightedAcademicScore } = computeAggregate(scores);

    // Persist each normalized SubjectScore row (upsert on the
    // [studentId, subject, level] unique constraint) and the aggregate
    // AcademicProfile in a single transaction so partial writes can't occur.
    // The AcademicProfile upsert is always last, so its result is always
    // at the final index regardless of how many subject scores were sent.
    const results = await prisma.$transaction([
      ...scores.map((entry) =>
        prisma.subjectScore.upsert({
          where: {
            studentId_subject_level: {
              studentId,
              subject: entry.subject as Subject,
              level: entry.level as AcademicLevel,
            },
          },
          update: { score: entry.score },
          create: {
            studentId,
            subject: entry.subject as Subject,
            level: entry.level as AcademicLevel,
            score: entry.score,
          },
        })
      ),
      prisma.academicProfile.upsert({
        where: { studentId },
        update: {
          jss3Average,
          ss1Average,
          weightedAcademicScore,
          tradeSubjectChosen: tradeSubjectChosen as Subject | undefined,
        },
        create: {
          studentId,
          jss3Average,
          ss1Average,
          weightedAcademicScore,
          tradeSubjectChosen: tradeSubjectChosen as Subject | undefined,
        },
      }),
    ]);
    const profile = results[results.length - 1];

    res.json({ message: "Academic scores saved", profile });
  }
);

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const studentId = req.student!.id;

  const [profile, subjectScores] = await Promise.all([
    prisma.academicProfile.findUnique({ where: { studentId } }),
    prisma.subjectScore.findMany({ where: { studentId }, orderBy: [{ level: "asc" }, { subject: "asc" }] }),
  ]);

  if (!profile) {
    res.status(404).json({ error: "Academic profile not found. Please submit your scores first." });
    return;
  }
  res.json({ profile, subjectScores });
});