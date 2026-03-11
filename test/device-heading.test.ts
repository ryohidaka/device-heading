import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import { DeviceHeading } from "../src";
import { emit, listenerCount, makeEvent, setup, teardown } from "./globals";
import { OrientationEventType, UnsupportedEnvironmentError } from "../src/utils";

describe("DeviceHeading", () => {
	describe("Supported", () => {
		beforeEach(setup);
		afterEach(teardown);

		describe("isSupported()", () => {
			it("returns true when supported", () => {
				expect(new DeviceHeading().isSupported()).toBe(true);
			});
		});

		describe("once()", () => {
			it("resolves with computed heading from absolute angles", async () => {
				const compass = new DeviceHeading();
				const promise = compass.once();
				emit(
					OrientationEventType.Absolute,
					makeEvent({ alpha: 0, beta: 0, gamma: 0, absolute: true }),
				);
				expect(await promise).toBe(0);
			});

			it("removes the listener after the first event", async () => {
				const compass = new DeviceHeading();
				const promise = compass.once();
				emit(OrientationEventType.Absolute, makeEvent());
				await promise;
				expect(listenerCount(OrientationEventType.Absolute)).toBe(0);
			});

			it("resolves with rounded heading when precision is set", async () => {
				const compass = new DeviceHeading({ precision: 1 });
				const promise = compass.once();
				emit(OrientationEventType.Absolute, makeEvent({ alpha: 180, beta: 180, gamma: 0 }));
				const result = await promise;
				expect(result).toBe(Math.round(result * 10) / 10);
			});
		});
	});

	describe("Unsupported", () => {
		describe("isSupported()", () => {
			it("returns false when unsupported", () => {
				expect(new DeviceHeading().isSupported()).toBe(false);
			});
		});

		describe("once()", () => {
			it("throws when unsupported", () => {
				expect(() => new DeviceHeading().once()).toThrow(UnsupportedEnvironmentError);
			});
		});
	});
});
