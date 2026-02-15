/**
 * Duration Normalizer Tests
 *
 * Tests for duration value normalization.
 */
import { describe, expect, it } from "bun:test";
import {
  normalizeDurationValue,
  durationToW3C,
  durationToLegacy,
  durationToMs,
  durationToSeconds,
} from "../../src/normalize/duration";
import type { W3CDurationValue } from "../../src/types/w3c";

describe("Duration Normalizer", () => {
  describe("normalizeDurationValue", () => {
    it("should pass through W3C duration unchanged", () => {
      const w3c: W3CDurationValue = { value: 500, unit: "ms" };
      const result = normalizeDurationValue(w3c);
      expect(result).toEqual(w3c);
    });

    it("should pass through W3C duration with seconds", () => {
      const w3c: W3CDurationValue = { value: 0.5, unit: "s" };
      const result = normalizeDurationValue(w3c);
      expect(result).toEqual(w3c);
    });

    it("should normalize ms string", () => {
      const result = normalizeDurationValue("500ms");
      expect(result).toBe("500ms");
    });

    it("should normalize seconds string", () => {
      const result = normalizeDurationValue("0.5s");
      expect(result).toBe("0.5s");
    });

    it("should pass through token alias unchanged", () => {
      const result = normalizeDurationValue("{animation.duration}");
      expect(result).toBe("{animation.duration}");
    });

    it("should handle zero string", () => {
      const result = normalizeDurationValue("0");
      expect(result).toBe("0ms");
    });

    it("should throw for invalid W3C value type", () => {
      const invalid = { value: "500", unit: "ms" };
      expect(() => normalizeDurationValue(invalid)).toThrow("not a valid DTFM duration value");
    });

    it("should throw for negative W3C value", () => {
      const invalid = { value: -500, unit: "ms" };
      expect(() => normalizeDurationValue(invalid)).toThrow("Must be a non-negative number");
    });

    it("should throw for invalid W3C unit", () => {
      const invalid = { value: 500, unit: "min" };
      expect(() => normalizeDurationValue(invalid)).toThrow("not a valid DTFM duration value");
    });

    it("should throw for invalid string format", () => {
      expect(() => normalizeDurationValue("500min")).toThrow("not a valid DTFM duration value");
    });
  });

  describe("durationToW3C", () => {
    it("should pass through W3C duration unchanged", () => {
      const w3c: W3CDurationValue = { value: 500, unit: "ms" };
      expect(durationToW3C(w3c)).toEqual(w3c);
    });

    it("should convert ms string to W3C", () => {
      const result = durationToW3C("500ms");
      expect(result).toEqual({ value: 500, unit: "ms" });
    });

    it("should convert seconds string to W3C", () => {
      const result = durationToW3C("0.5s");
      expect(result).toEqual({ value: 0.5, unit: "s" });
    });

    it("should throw for non-string", () => {
      expect(() => durationToW3C(500 as any)).toThrow("Cannot convert");
    });

    it("should throw for invalid string", () => {
      expect(() => durationToW3C("500min")).toThrow("Invalid duration string");
    });
  });

  describe("durationToLegacy", () => {
    it("should pass through string unchanged", () => {
      expect(durationToLegacy("500ms")).toBe("500ms");
    });

    it("should convert W3C ms to string", () => {
      const w3c: W3CDurationValue = { value: 500, unit: "ms" };
      expect(durationToLegacy(w3c)).toBe("500ms");
    });

    it("should convert W3C seconds to string", () => {
      const w3c: W3CDurationValue = { value: 0.5, unit: "s" };
      expect(durationToLegacy(w3c)).toBe("0.5s");
    });

    it("should throw for invalid type", () => {
      expect(() => durationToLegacy(500 as any)).toThrow("Cannot convert");
    });
  });

  describe("durationToMs", () => {
    it("should return ms value unchanged", () => {
      expect(durationToMs("500ms")).toBe(500);
    });

    it("should convert seconds to ms", () => {
      expect(durationToMs("0.5s")).toBe(500);
      expect(durationToMs("1s")).toBe(1000);
    });

    it("should work with W3C format", () => {
      const w3c: W3CDurationValue = { value: 500, unit: "ms" };
      expect(durationToMs(w3c)).toBe(500);
    });

    it("should work with W3C seconds format", () => {
      const w3c: W3CDurationValue = { value: 0.5, unit: "s" };
      expect(durationToMs(w3c)).toBe(500);
    });
  });

  describe("durationToSeconds", () => {
    it("should return seconds value unchanged", () => {
      expect(durationToSeconds("0.5s")).toBe(0.5);
    });

    it("should convert ms to seconds", () => {
      expect(durationToSeconds("500ms")).toBe(0.5);
      expect(durationToSeconds("1000ms")).toBe(1);
    });

    it("should work with W3C format", () => {
      const w3c: W3CDurationValue = { value: 0.5, unit: "s" };
      expect(durationToSeconds(w3c)).toBe(0.5);
    });

    it("should work with W3C ms format", () => {
      const w3c: W3CDurationValue = { value: 500, unit: "ms" };
      expect(durationToSeconds(w3c)).toBe(0.5);
    });
  });
});
