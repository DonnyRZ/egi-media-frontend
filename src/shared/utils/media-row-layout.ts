export interface MediaWidthCandidate {
  width: number;
  textHeight: number;
}

/** Bounded widths derived only from the available card space, never article IDs. */
export function mediaWidthCandidates(containerWidth: number, gap: number, scale = 1): number[] {
  if (containerWidth <= gap) return [];
  const maximum = Math.min(containerWidth * .42, containerWidth - gap - Math.min(160 * scale, containerWidth * .55));
  return [.32, .36, .4].map((fraction, index) =>
    Math.max(1, Math.round(Math.min(containerWidth * fraction, (128 + index * 12) * scale, maximum))),
  ).filter((width, index, all) => all.indexOf(width) === index);
}

/** Prefer a slightly larger photo when text fits; otherwise minimize dead space. */
export function chooseMediaWidth(candidates: MediaWidthCandidate[], scale = 1): number | undefined {
  const fitting = candidates.filter(({ width, textHeight }) => textHeight <= width * 9 / 16 + 16 * scale);
  if (fitting.length) return Math.max(...fitting.map(({ width }) => width));
  return [...candidates].sort((a, b) =>
    Math.abs(a.textHeight - a.width * 9 / 16) - Math.abs(b.textHeight - b.width * 9 / 16) || b.width - a.width,
  )[0]?.width;
}
