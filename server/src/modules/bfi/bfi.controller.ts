import type { Request, Response } from "express";
import { prisma } from "@/db/prisma.js";
import { asyncHandler } from "@/middleware/index.js";
import { computeBFI, BFI_QUESTIONS } from "@/engine/bfi.js";
import type { BfiSubmitInput } from "@/validators/schemas.js";

export function getBfiQuestions(_req: Request, res: Response): void {
  res.json({ questions: BFI_QUESTIONS, total: BFI_QUESTIONS.length });
}

export const submitBFI = asyncHandler<Request<Record<string, never>, unknown, BfiSubmitInput>>(
  async (req, res: Response) => {
    const studentId = req.student!.id;
    const { responses } = req.body;

    const result = computeBFI(responses);

    const profile = await prisma.personalityProfile.upsert({
      where: { studentId },
      update: { ...result },
      create: { studentId, ...result },
    });

    // Persist raw per-item responses for audit/re-scoring.
    await prisma.$transaction(
      responses.map((value, idx) =>
        prisma.bfiResponse.upsert({
          where: { studentId_questionId: { studentId, questionId: BFI_QUESTIONS[idx]!.id } },
          update: { value, trait: BFI_QUESTIONS[idx]!.trait, reverseKeyed: BFI_QUESTIONS[idx]!.reverseKeyed },
          create: {
            studentId,
            questionId: BFI_QUESTIONS[idx]!.id,
            trait: BFI_QUESTIONS[idx]!.trait,
            reverseKeyed: BFI_QUESTIONS[idx]!.reverseKeyed,
            value,
          },
        })
      )
    );

    res.json({ message: "Personality (BFI) profile saved", profile });
  }
);

export const getBFI = asyncHandler(async (req: Request, res: Response) => {
  const profile = await prisma.personalityProfile.findUnique({ where: { studentId: req.student!.id } });
  if (!profile) {
    res.status(404).json({ error: "Personality profile not found. Please complete the BFI assessment first." });
    return;
  }
  res.json({ profile });
});