export type Point = {
  x: number;
  y: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PositionConstraints = {
  containerWidth: number;
  containerHeight: number;
  buttonWidth: number;
  buttonHeight: number;
  padding: number;
  minimumTravelDistance: number;
  obstacleRects: Rect[];
  obstacleGap?: number;
};

export function distanceBetweenPoints(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function rectsIntersectWithGap(
  a: Rect,
  b: Rect,
  gap: number,
): boolean {
  const expandedB = {
    x: b.x - gap,
    y: b.y - gap,
    width: b.width + gap * 2,
    height: b.height + gap * 2,
  };

  return (
    a.x < expandedB.x + expandedB.width &&
    a.x + a.width > expandedB.x &&
    a.y < expandedB.y + expandedB.height &&
    a.y + a.height > expandedB.y
  );
}

export function clampPosition(
  position: Point,
  constraints: Pick<
    PositionConstraints,
    "containerWidth" | "containerHeight" | "buttonWidth" | "buttonHeight" | "padding"
  >,
): Point {
  const minX = Math.max(0, constraints.padding);
  const minY = Math.max(0, constraints.padding);
  const maxX = Math.max(
    minX,
    constraints.containerWidth - constraints.buttonWidth - constraints.padding,
  );
  const maxY = Math.max(
    minY,
    constraints.containerHeight - constraints.buttonHeight - constraints.padding,
  );

  return {
    x: clamp(position.x, minX, maxX),
    y: clamp(position.y, minY, maxY),
  };
}

export function findSafeRunawayPosition({
  currentPosition,
  pointerPosition,
  constraints,
  random = Math.random,
  attempts = 36,
}: {
  currentPosition: Point;
  pointerPosition: Point;
  constraints: PositionConstraints;
  random?: () => number;
  attempts?: number;
}): Point {
  const normalized = normalizeConstraints(constraints);
  const minX = normalized.padding;
  const minY = normalized.padding;
  const maxX = Math.max(
    minX,
    normalized.containerWidth - normalized.buttonWidth - normalized.padding,
  );
  const maxY = Math.max(
    minY,
    normalized.containerHeight - normalized.buttonHeight - normalized.padding,
  );

  const current = clampPosition(currentPosition, normalized);
  const candidates: Point[] = [];

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    candidates.push({
      x: minX + random() * Math.max(0, maxX - minX),
      y: minY + random() * Math.max(0, maxY - minY),
    });
  }

  const randomCandidate = candidates.find((candidate) =>
    isValidCandidate(candidate, current, normalized, true),
  );

  if (randomCandidate) {
    return clampPosition(randomCandidate, normalized);
  }

  const fallbackCandidates = getFallbackCandidates(normalized);
  const validFallbacks = fallbackCandidates.filter((candidate) =>
    isValidCandidate(candidate, current, normalized, false),
  );
  const candidatesToRank = validFallbacks.length > 0 ? validFallbacks : fallbackCandidates;

  const farthest = candidatesToRank.reduce((best, candidate) => {
    const score = fallbackScore(candidate, current, pointerPosition);
    return score > fallbackScore(best, current, pointerPosition) ? candidate : best;
  }, candidatesToRank[0] ?? current);

  return clampPosition(farthest, normalized);
}

function isValidCandidate(
  candidate: Point,
  current: Point,
  constraints: Required<PositionConstraints>,
  requireTravelDistance: boolean,
): boolean {
  const clamped = clampPosition(candidate, constraints);

  if (clamped.x !== candidate.x || clamped.y !== candidate.y) {
    return false;
  }

  const rect = pointToRect(candidate, constraints);
  const intersectsObstacle = constraints.obstacleRects.some((obstacle) =>
    rectsIntersectWithGap(rect, obstacle, constraints.obstacleGap),
  );

  if (intersectsObstacle) {
    return false;
  }

  if (
    requireTravelDistance &&
    distanceBetweenPoints(candidate, current) < constraints.minimumTravelDistance
  ) {
    return false;
  }

  return true;
}

function getFallbackCandidates(
  constraints: Required<PositionConstraints>,
): Point[] {
  const minX = constraints.padding;
  const minY = constraints.padding;
  const maxX = Math.max(
    minX,
    constraints.containerWidth - constraints.buttonWidth - constraints.padding,
  );
  const maxY = Math.max(
    minY,
    constraints.containerHeight - constraints.buttonHeight - constraints.padding,
  );
  const centerY = minY + (maxY - minY) / 2;

  return [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: minX, y: maxY },
    { x: maxX, y: maxY },
    { x: maxX, y: centerY },
  ];
}

function pointToRect(
  point: Point,
  constraints: Pick<PositionConstraints, "buttonWidth" | "buttonHeight">,
): Rect {
  return {
    x: point.x,
    y: point.y,
    width: constraints.buttonWidth,
    height: constraints.buttonHeight,
  };
}

function fallbackScore(candidate: Point, current: Point, pointer: Point): number {
  return (
    distanceBetweenPoints(candidate, current) * 0.8 +
    distanceBetweenPoints(candidate, pointer)
  );
}

function normalizeConstraints(
  constraints: PositionConstraints,
): Required<PositionConstraints> {
  return {
    containerWidth: Math.max(0, finiteOrZero(constraints.containerWidth)),
    containerHeight: Math.max(0, finiteOrZero(constraints.containerHeight)),
    buttonWidth: Math.max(1, finiteOrZero(constraints.buttonWidth)),
    buttonHeight: Math.max(1, finiteOrZero(constraints.buttonHeight)),
    padding: Math.max(0, finiteOrZero(constraints.padding)),
    minimumTravelDistance: Math.max(
      0,
      finiteOrZero(constraints.minimumTravelDistance),
    ),
    obstacleRects: constraints.obstacleRects.filter((rect) =>
      [rect.x, rect.y, rect.width, rect.height].every(Number.isFinite),
    ),
    obstacleGap: Math.max(0, finiteOrZero(constraints.obstacleGap ?? 12)),
  };
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
