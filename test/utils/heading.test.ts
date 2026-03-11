import { describe, it, expect } from "bun:test";
import { HeadingUnavailableError, resolveHeading } from "../../src/utils";
import { makeEvent } from "../globals";

describe("resolveHeading", () => {
	describe("absolute alpha/beta/gamma", () => {
		it("returns a value in [0, 360)", () => {
			const heading = resolveHeading(makeEvent({ alpha: 45, beta: 30, gamma: 15, absolute: true }));
			expect(heading).toBeGreaterThanOrEqual(0);
			expect(heading).toBeLessThan(360);
		});

		it("returns 0 for all-zero angles", () => {
			expect(resolveHeading(makeEvent({ alpha: 0, beta: 0, gamma: 0, absolute: true }))).toBe(0);
		});

		it("never returns a negative value", () => {
			for (const alpha of [180, 270, 350]) {
				const heading = resolveHeading(makeEvent({ alpha, beta: 45, gamma: -45, absolute: true }));
				expect(heading).toBeGreaterThanOrEqual(0);
				expect(heading).toBeLessThan(360);
			}
		});
	});

	describe("precision", () => {
		it("returns raw heading when precision is omitted", () => {
			const result = resolveHeading(makeEvent({ alpha: 180, beta: 180, gamma: 0 }));
			expect(result).toBeCloseTo(180);
		});

		it("rounds to the specified decimal places", () => {
			const result = resolveHeading(makeEvent({ alpha: 180, beta: 180, gamma: 0 }), 1);
			expect(result).toBe(Math.round(result * 10) / 10);
		});

		it("rounds to integer when precision is 0", () => {
			const result = resolveHeading(makeEvent({ alpha: 180, beta: 180, gamma: 0 }), 0);
			expect(Number.isInteger(result)).toBe(true);
		});
	});

	describe("errors", () => {
		it("throws when event is null", () => {
			expect(() => resolveHeading(null as unknown as DeviceOrientationEvent)).toThrow(
				HeadingUnavailableError,
			);
		});

		it("throws when alpha is null", () => {
			expect(() =>
				resolveHeading(makeEvent({ alpha: null as unknown as number, absolute: true })),
			).toThrow(HeadingUnavailableError);
		});

		it("throws when beta is NaN", () => {
			expect(() => resolveHeading(makeEvent({ beta: NaN, absolute: true }))).toThrow(
				HeadingUnavailableError,
			);
		});

		it("throws when absolute is false", () => {
			expect(() =>
				resolveHeading(makeEvent({ alpha: 0, beta: 0, gamma: 0, absolute: false })),
			).toThrow(HeadingUnavailableError);
		});
	});

	describe("iOS (webkitCompassHeading)", () => {
		it("returns webkitCompassHeading when present", () => {
			expect(resolveHeading(makeEvent({ webkitCompassHeading: 123.4 }))).toBe(123.4);
		});

		it("returns 0 when webkitCompassHeading is 0", () => {
			expect(resolveHeading(makeEvent({ webkitCompassHeading: 0 }))).toBe(0);
		});
	});
});
