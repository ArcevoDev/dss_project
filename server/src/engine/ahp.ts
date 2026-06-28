/**
 * AHP ENGINE — Analytic Hierarchy Process
 * ----------------------------------------
 * Derives criterion weights from the pairwise comparison matrix synthesised
 * from five guidance counsellors' expert judgement (thesis §3.5.2).
 * Validates consistency via Consistency Ratio (CR <= 0.10, Saaty 1980).
 *
 * Criteria:
 *   C1 = Academic Performance
 *   C2 = Vocational Interest (RIASEC)
 *   C3 = Personality Traits
 *
 * Pairwise matrix (expert-derived, Saaty 1-9 ratio scale):
 *        C1    C2    C3
 *   C1 [  1,    2,    3  ]
 *   C2 [ 1/2,   1,    2  ]
 *   C3 [ 1/3,  1/2,   1  ]
 *
 * Expected derived weights: ω1 ≈ 0.540, ω2 ≈ 0.297, ω3 ≈ 0.163 (CR ≈ 0.007).
 */

import type { AhpResult } from "@/types/domain";

// ── Raw pairwise comparison matrix ─────────────────────────
const PAIRWISE_MATRIX: number[][] = [
  [1, 2, 3],
  [1 / 2, 1, 2],
  [1 / 3, 1 / 2, 1],
];

// ── Saaty Random Index table (n = 1 to 10) ─────────────────
const RANDOM_INDEX: number[] = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

/**
 * Compute AHP weights and validate consistency.
 */
export function computeAHPWeights(): AhpResult {
  const n = PAIRWISE_MATRIX.length;

  // Step 1: Column sums
  const colSums = Array(n).fill(0) as number[];
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const row = PAIRWISE_MATRIX[i];
      const cell = row?.[j];
      if (typeof cell === "number") {
        colSums[j] = (colSums[j] ?? 0) + cell;
      }
    }
  }

  // Step 2: Normalise each cell by its column sum
  const normalised = PAIRWISE_MATRIX.map((row) => row.map((val, j) => val / colSums[j]!));

  // Step 3: Priority vector = row averages of normalised matrix
  const weights = normalised.map((row) => {
    const sum = row.reduce((a, b) => a + b, 0);
    return sum / n;
  });

  // Step 4: Compute lambda_max
  const weightedSumVector = PAIRWISE_MATRIX.map((row) =>
    row.reduce((sum, val, j) => sum + val * weights[j]!, 0)
  );
  const lambdaValues = weightedSumVector.map((val, i) => val / weights[i]!);
  const lambdaMax = lambdaValues.reduce((a, b) => a + b, 0) / n;

  // Step 5: Consistency Index
  const ci = (lambdaMax - n) / (n - 1);

  // Step 6: Consistency Ratio
  const ri = RANDOM_INDEX[n] ?? 1.49;
  const cr = ri === 0 ? 0 : ci / ri;

  return {
    weights: [weights[0]!, weights[1]!, weights[2]!],
    lambda: lambdaMax,
    ci: parseFloat(ci.toFixed(4)),
    cr: parseFloat(cr.toFixed(4)),
    consistent: cr <= 0.1,
    labels: ["Academic Performance", "Vocational Interest (RIASEC)", "Personality Traits"],
  };
}

// Pre-computed weights (exported for direct use in the SAW engine)
export const AHP_WEIGHTS: AhpResult = computeAHPWeights();

// Named weight exports for clarity
export const W_ACADEMIC: number = AHP_WEIGHTS.weights[0]; // ≈ 0.540
export const W_RIASEC: number = AHP_WEIGHTS.weights[1]; // ≈ 0.297
export const W_PERSONALITY: number = AHP_WEIGHTS.weights[2]; // ≈ 0.163