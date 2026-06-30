/**
 * CONFIDENCE & GUIDANCE INSIGHTS ENGINE
 * ----------------------------------------
 * Generates plain-language explanation of the DSS recommendation.
 * Maps top stream + RIASEC Summary Code to human-readable guidance.
 */

import type { RiasecLetter, SawResult, Stream } from "@/types/domain.js";

interface StreamDescription {
  subjects: string;
  careers: string;
  trait: string;
}

const STREAM_DESCRIPTIONS: Record<Stream, StreamDescription> = {
  Science: {
    subjects: "Biology, Chemistry, and Physics",
    careers: "Medicine, Engineering, Pharmacy, Computer Science, Biochemistry",
    trait: "analytical and investigative",
  },
  Humanities: {
    subjects: "Literature in English, Government, and either History or CRS/IRS",
    careers: "Law, Journalism, Mass Communication, Education, International Relations",
    trait: "creative and people-oriented",
  },
  Business: {
    subjects: "Economics, Commerce, and Accounting",
    careers: "Accounting, Business Administration, Banking & Finance, Marketing, Economics",
    trait: "organised and enterprising",
  },
};

const RIASEC_DESCRIPTIONS: Record<RiasecLetter, string> = {
  R: "practical and hands-on",
  I: "investigative and scientific",
  A: "artistic and imaginative",
  S: "socially oriented and empathetic",
  E: "enterprising and leadership-driven",
  C: "conventional and detail-focused",
};

/**
 * Generate Guidance Insight text from recommendation output.
 */
export function generateGuidanceInsight(
  topStream: Stream,
  summaryCode: string,
  confidenceLevel: number,
  academicScore: number,
  sawResult: SawResult
): string {
  const sd = STREAM_DESCRIPTIONS[topStream];
  const primaryType = summaryCode[0] as RiasecLetter | undefined;
  const typeDesc = (primaryType && RIASEC_DESCRIPTIONS[primaryType]) || "well-rounded";

  const ranked = sawResult.ranked;
  const second = ranked[1]?.stream ?? "";
  const vTop = ((ranked[0]?.score ?? 0) * 100).toFixed(1);
  const vSec = ((ranked[1]?.score ?? 0) * 100).toFixed(1);

  const academicComment =
    academicScore >= 70
      ? "Your academic performance is strong"
      : academicScore >= 55
        ? "Your academic performance is satisfactory"
        : "Your academic performance indicates room for growth";

  const confidenceComment =
    confidenceLevel >= 80
      ? "with a high degree of confidence"
      : confidenceLevel >= 65
        ? "with moderate confidence"
        : "though your profile shows some overlap with other streams";

  const insight = [
    `Based on your profile, the DSS recommends the ${topStream} Stream ${confidenceComment} (Confidence Level: ${confidenceLevel}%).`,
    ``,
    `${academicComment}, contributing a weighted academic score of ${academicScore.toFixed(1)}/100.`,
    `Your RIASEC profile (${summaryCode}) indicates a dominant ${typeDesc} personality type, which aligns strongly with the ${topStream} stream environment.`,
    ``,
    `In the ${topStream} Stream, you will study ${sd.subjects} as your core elective subjects.`,
    `This stream opens pathways to careers in: ${sd.careers}.`,
    ``,
    `Stream ranking: ${topStream} (${vTop}) > ${second} (${vSec}).`,
    ``,
    `Note: This recommendation is a data-driven guide. Please discuss your final decision with a qualified guidance counsellor and your parents or guardians.`,
  ].join("\n");

  return insight;
}