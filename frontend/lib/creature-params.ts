import type { CreatureParams, RiskFlag, UserStats, BodyShape, RiskFlagLocation } from './types';

const SHAPES: BodyShape[] = ['blob', 'angular', 'spiked', 'crystalline'];

export function generateCreatureParams(
  embedding: { x: number; y: number },
  stats: UserStats,
  riskFlags: RiskFlag[]
): CreatureParams {
  // UMAP output assumed in [-3, 3]; clamp to [0,1]
  const xNorm = Math.min(Math.max((embedding.x + 3) / 6, 0), 1);
  const yNorm = Math.min(Math.max((embedding.y + 3) / 6, 0), 1);

  const bodyShape = SHAPES[Math.min(Math.floor(xNorm * 4), 3)];
  const paletteHue = yNorm * 360;
  // bodySize intentionally capped — prevents income-amount correlation
  const bodySize = 80 + (stats.consistency / 100) * 40;
  const appendageCount = Math.max(1, Math.floor(stats.foresight / 20) + 1);
  const auraIntensity = stats.restraint / 100;
  const textureDensity = stats.consistency / 100;
  const paletteSaturation = 60 + (stats.recovery / 100) * 30;
  const firstFlag = riskFlags[0];

  return {
    bodyShape,
    bodySize,
    paletteHue,
    paletteSaturation,
    appendageCount,
    auraIntensity,
    textureDensity,
    hasRiskFlag: riskFlags.length > 0,
    riskFlagLocation: (firstFlag?.affected_area ?? 'body') as RiskFlagLocation,
  };
}
