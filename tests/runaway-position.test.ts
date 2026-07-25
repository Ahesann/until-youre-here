import { describe, expect, it } from "vitest";
import {
  clampPosition,
  distanceBetweenPoints,
  findSafeRunawayPosition,
  rectsIntersectWithGap,
  type PositionConstraints,
  type Rect,
} from "@/lib/runaway-position";

const baseConstraints: PositionConstraints = {
  containerWidth: 360,
  containerHeight: 170,
  buttonWidth: 74,
  buttonHeight: 44,
  padding: 16,
  minimumTravelDistance: 80,
  obstacleGap: 12,
  obstacleRects: [{ x: 22, y: 96, width: 150, height: 50 }],
};

describe("runaway position utilities", () => {
  it("keeps the candidate inside bounds", () => {
    const position = findSafeRunawayPosition({
      currentPosition: { x: 260, y: 108 },
      pointerPosition: { x: 300, y: 124 },
      constraints: baseConstraints,
      random: fixedRandom([0.7, 0.1]),
    });

    expect(position.x).toBeGreaterThanOrEqual(16);
    expect(position.y).toBeGreaterThanOrEqual(16);
    expect(position.x + baseConstraints.buttonWidth).toBeLessThanOrEqual(344);
    expect(position.y + baseConstraints.buttonHeight).toBeLessThanOrEqual(154);
  });

  it("respects internal padding", () => {
    const position = clampPosition({ x: -100, y: -40 }, baseConstraints);

    expect(position).toEqual({ x: 16, y: 16 });
  });

  it("does not overlap the Yes button obstacle", () => {
    const yesButton: Rect = { x: 20, y: 104, width: 156, height: 48 };
    const position = findSafeRunawayPosition({
      currentPosition: { x: 266, y: 110 },
      pointerPosition: { x: 300, y: 132 },
      constraints: {
        ...baseConstraints,
        obstacleRects: [yesButton],
      },
      random: fixedRandom([0.1, 0.85, 0.8, 0.12]),
    });

    expect(
      rectsIntersectWithGap(
        { ...position, width: 74, height: 44 },
        yesButton,
        12,
      ),
    ).toBe(false);
  });

  it("does not overlap another obstacle", () => {
    const hiddenHeart: Rect = { x: 284, y: 12, width: 44, height: 44 };
    const position = findSafeRunawayPosition({
      currentPosition: { x: 260, y: 106 },
      pointerPosition: { x: 292, y: 30 },
      constraints: {
        ...baseConstraints,
        obstacleRects: [...baseConstraints.obstacleRects, hiddenHeart],
      },
      random: fixedRandom([0.86, 0.05, 0.45, 0.2]),
    });

    expect(
      rectsIntersectWithGap(
        { ...position, width: 74, height: 44 },
        hiddenHeart,
        12,
      ),
    ).toBe(false);
  });

  it("satisfies minimum travel distance when possible", () => {
    const current = { x: 260, y: 110 };
    const position = findSafeRunawayPosition({
      currentPosition: current,
      pointerPosition: { x: 278, y: 126 },
      constraints: baseConstraints,
      random: fixedRandom([0.05, 0.05]),
    });

    expect(distanceBetweenPoints(position, current)).toBeGreaterThanOrEqual(80);
  });

  it("returns a valid clamped position for narrow containers", () => {
    const constraints: PositionConstraints = {
      containerWidth: 188,
      containerHeight: 128,
      buttonWidth: 74,
      buttonHeight: 44,
      padding: 12,
      minimumTravelDistance: 60,
      obstacleGap: 10,
      obstacleRects: [{ x: 12, y: 70, width: 90, height: 44 }],
    };
    const position = findSafeRunawayPosition({
      currentPosition: { x: 102, y: 72 },
      pointerPosition: { x: 140, y: 92 },
      constraints,
      random: fixedRandom([0.8, 0.1, 0.1, 0.1]),
    });

    expect(position.x).toBeGreaterThanOrEqual(12);
    expect(position.x + constraints.buttonWidth).toBeLessThanOrEqual(176);
  });

  it("handles oversized impossible layouts with a safe fallback", () => {
    const constraints: PositionConstraints = {
      containerWidth: 52,
      containerHeight: 40,
      buttonWidth: 74,
      buttonHeight: 44,
      padding: 12,
      minimumTravelDistance: 60,
      obstacleGap: 10,
      obstacleRects: [{ x: 0, y: 0, width: 52, height: 40 }],
    };
    const position = findSafeRunawayPosition({
      currentPosition: { x: 999, y: 999 },
      pointerPosition: { x: 26, y: 20 },
      constraints,
      random: fixedRandom([0.5, 0.5]),
    });

    expect(position).toEqual({ x: 12, y: 12 });
  });

  it("re-clamps after container shrink", () => {
    const position = clampPosition(
      { x: 260, y: 110 },
      {
        containerWidth: 220,
        containerHeight: 128,
        buttonWidth: 74,
        buttonHeight: 44,
        padding: 12,
      },
    );

    expect(position).toEqual({ x: 134, y: 72 });
  });

  it("rejects rectangles touching within the configured gap", () => {
    const a: Rect = { x: 10, y: 10, width: 50, height: 40 };
    const b: Rect = { x: 70, y: 10, width: 40, height: 40 };

    expect(rectsIntersectWithGap(a, b, 12)).toBe(true);
    expect(rectsIntersectWithGap(a, b, 4)).toBe(false);
  });
});

function fixedRandom(values: number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
}
