import type { Request, Response } from "express";
import { prisma } from "@/db/prisma.js";
import { asyncHandler } from "@/middleware/index.js";
import { computeSAW, generateGuidanceInsight, AHP_WEIGHTS } from "@/engine/index.js";
import { AcademicStream } from "@prisma-client";
import type { PersonalityInput } from "@/types/domain.js";

const ALGORITHM_VERSION = "ahp-saw-v1.0";

// Neutral fallback used ONLY if a student reaches recommendation generation
// without having completed the BFI-20 assessment. This keeps the endpoint
// usable end-to-end even when a student skips an optional step, but the
// response flags `personalitySource: "default"` so the client can prompt
// them to take the real assessment for a more accurate result.
const DEFAULT_PERSONALITY: PersonalityInput = {
  opennessScore: 60,
  conscientiousnessScore: 60,
  extraversionScore: 60,
  agreeablenessScore: 60,
};

export const getRecommendation = asyncHandler(async (req: Request, res: Response) => {
  const studentId = req.student!.id;

  const academic = await prisma.academicProfile.findUnique({ where: { studentId } });
  if (!academic) {
    res.status(400).json({ error: "Academic scores not found. Please complete Step 1 first." });
    return;
  }

  const riasec = await prisma.riasecProfile.findUnique({ where: { studentId } });
  if (!riasec) {
    res.status(400).json({ error: "RIASEC assessment not found. Please complete Step 2 first." });
    return;
  }

  // Real personality data now, not a hardcoded stub. Falls back to a
  // neutral default only if the student genuinely hasn't taken the BFI yet.
  const personalityProfile = await prisma.personalityProfile.findUnique({ where: { studentId } });
  const personalitySource: "assessed" | "default" = personalityProfile ? "assessed" : "default";
  const personality: PersonalityInput = personalityProfile
    ? {
        opennessScore: personalityProfile.opennessScore,
        conscientiousnessScore: personalityProfile.conscientiousnessScore,
        extraversionScore: personalityProfile.extraversionScore,
        agreeablenessScore: personalityProfile.agreeablenessScore,
      }
    : DEFAULT_PERSONALITY;

  const sawResult = computeSAW(
    { weightedScore: academic.weightedAcademicScore },
    {
      scienceAffinity: riasec.scienceAffinity,
      humanitiesAffinity: riasec.humanitiesAffinity,
      businessAffinity: riasec.businessAffinity,
    },
    personality
  );

  const guidanceInsight = generateGuidanceInsight(
    sawResult.topStream,
    riasec.summaryCode,
    sawResult.confidenceLevel,
    academic.weightedAcademicScore,
    sawResult
  );

  const streamEnumMap = {
    Science: AcademicStream.SCIENCE,
    Humanities: AcademicStream.HUMANITIES,
    Business: AcademicStream.BUSINESS,
  } as const;

  const log = await prisma.recommendationLog.create({
    data: {
      studentId,
      topStream: streamEnumMap[sawResult.topStream],
      vScience: sawResult.vScience,
      vHumanities: sawResult.vHumanities,
      vBusiness: sawResult.vBusiness,
      confidenceLevel: sawResult.confidenceLevel,
      guidanceInsight,
      algorithmVersion: ALGORITHM_VERSION,
      ahpWeightsSnapshot: JSON.parse(JSON.stringify(AHP_WEIGHTS)),
      inputsSnapshot: JSON.parse(
        JSON.stringify({ academic, riasec, personality, personalitySource })
      ),
    },
  });

  res.json({
    recommendation: {
      ...sawResult,
      guidanceInsight,
      ahpWeights: AHP_WEIGHTS,
      personalitySource,
      logId: log.id,
    },
  });
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const logs = await prisma.recommendationLog.findMany({
    where: { studentId: req.student!.id },
    orderBy: { generatedAt: "desc" },
    take: 10,
  });
  res.json({ history: logs });
});