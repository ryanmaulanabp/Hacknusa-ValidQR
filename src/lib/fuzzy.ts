import levenshtein from 'fast-levenshtein';

export interface FuzzyDebug {
  input: string;
  target: string;
  levenshteinDistance: number;
  levenshteinScore: number;
  tokensA: string[];
  tokensB: string[];
  matchedTokens: string[];
  tokenScore: number;
  finalScore: number;
}

export interface FuzzyResult {
  score: number;
  debug: FuzzyDebug;
}

/**
 * Hybrid Fuzzy Matching — combines character-level (Levenshtein)
 * and word-level (token overlap) similarity.
 *
 * WEIGHTS: Levenshtein 40% + Token Overlap 60%
 *
 * Calibration (HackNusa demo stickers):
 *   Sticker A (Asli):    "WARUNG BAKSO PAK BUDI" vs "WARUNG BAKSO PAK BUDI" -> 100%
 *   Sticker C (Rebrand): "BAKSO BUDI DIPATIUKUR" vs "WARUNG BAKSO PAK BUDI" -> ~45%
 */
export const fuzzyMatch = (input: string, target: string): FuzzyResult => {
  const a = (input || '').toLowerCase().trim();
  const b = (target || '').toLowerCase().trim();

  if (!a && !b) {
    return {
      score: 100,
      debug: {
        input: a,
        target: b,
        levenshteinDistance: 0,
        levenshteinScore: 100,
        tokensA: [],
        tokensB: [],
        matchedTokens: [],
        tokenScore: 100,
        finalScore: 100,
      },
    };
  }

  // --- Strategy 1: Character-level Levenshtein ---
  const distance = levenshtein.get(a, b);
  const maxLen = Math.max(a.length, b.length);
  const levenshteinScore = maxLen > 0 ? ((maxLen - distance) / maxLen) * 100 : 100;

  // --- Strategy 2: Word-level Token Overlap ---
  const tokensA = a.split(/\s+/).filter(Boolean);
  const tokensB = b.split(/\s+/).filter(Boolean);
  const matchedTokens = tokensA.filter(t => tokensB.includes(t));
  const maxTokens = Math.max(tokensA.length, tokensB.length);
  const tokenScore = maxTokens > 0
    ? (matchedTokens.length / maxTokens) * 100
    : 0;

  // --- Hybrid Weighted Score ---
  const WEIGHT_LEVENSHTEIN = 0.4;
  const WEIGHT_TOKEN = 0.6;
  const finalScore = (levenshteinScore * WEIGHT_LEVENSHTEIN) + (tokenScore * WEIGHT_TOKEN);

  const debug: FuzzyDebug = {
    input: a,
    target: b,
    levenshteinDistance: distance,
    levenshteinScore: parseFloat(levenshteinScore.toFixed(2)),
    tokensA,
    tokensB,
    matchedTokens,
    tokenScore: parseFloat(tokenScore.toFixed(2)),
    finalScore: Math.round(finalScore),
  };

  return {
    score: Math.round(finalScore),
    debug,
  };
};
