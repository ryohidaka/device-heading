import { describe, it, expect, afterEach, beforeEach, mock } from "bun:test";
import { DeviceHeading } from "../src";
import { emit, listenerCount, makeEvent, setup, teardown } from "./globals";
import { OrientationEventType, UnsupportedEnvironmentError } from "../src/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

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

		describe("start() / stop()", () => {
			it("delivers each event to the callback", () => {
				const compass = new DeviceHeading({ precision: 0 });
				const received: number[] = [];
				compass.start((h) => received.push(h));
				emit(OrientationEventType.Absolute, makeEvent({ alpha: 180, beta: 180, gamma: 0 }));
				emit(OrientationEventType.Absolute, makeEvent({ alpha: 360, beta: 360, gamma: 0 }));
				expect(received).toEqual([180, 180]);
			});

			it("delivers rounded heading when precision is set", () => {
				const compass = new DeviceHeading({ precision: 1 });
				const received: number[] = [];
				compass.start((h) => received.push(h));
				emit(OrientationEventType.Absolute, makeEvent({ alpha: 180, beta: 180, gamma: 0 }));
				const result = received[0];
				expect(result).toBe(Math.round(result * 10) / 10);
			});

			it("start() is idempotent — registers only one listener", () => {
				const compass = new DeviceHeading();
				compass.start(() => {});
				compass.start(() => {});
				expect(listenerCount(OrientationEventType.Absolute)).toBe(1);
			});

			it("stop() removes the listener", () => {
				const compass = new DeviceHeading();
				compass.start(() => {});
				compass.stop();
				expect(listenerCount(OrientationEventType.Absolute)).toBe(0);
			});

			it("stop() is a no-op when not started", () => {
				expect(() => new DeviceHeading().stop()).not.toThrow();
			});

			it("no events are delivered after stop()", () => {
				const compass = new DeviceHeading();
				const received: number[] = [];
				compass.start((h) => received.push(h));
				compass.stop();
				emit(OrientationEventType.Absolute, makeEvent());
				expect(received).toEqual([]);
			});
		});

		describe("hasIOSPermission()", () => {
			afterEach(() => {
				delete (g.DeviceOrientationEvent as Record<string, unknown>).requestPermission;
			});

			it("returns true on non-iOS (requestPermission not present)", async () => {
				expect(await new DeviceHeading().hasIOSPermission()).toBe(true);
			});

			it("returns true when iOS permission is granted", async () => {
				g.DeviceOrientationEvent.requestPermission = mock(async () => "granted");
				expect(await new DeviceHeading().hasIOSPermission()).toBe(true);
			});

			it("returns false when iOS permission is denied", async () => {
				g.DeviceOrientationEvent.requestPermission = mock(async () => "denied");
				expect(await new DeviceHeading().hasIOSPermission()).toBe(false);
			});

			it("returns false when requestPermission throws", async () => {
				g.DeviceOrientationEvent.requestPermission = mock(async () => {
					throw new Error("failed");
				});
				expect(await new DeviceHeading().hasIOSPermission()).toBe(false);
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

		describe("start()", () => {
			it("throws when unsupported", () => {
				expect(() => new DeviceHeading().start(() => {})).toThrow(UnsupportedEnvironmentError);
			});
		});

		describe("hasIOSPermission()", () => {
			it("rejects when unsupported", async () => {
				await expect(new DeviceHeading().hasIOSPermission()).rejects.toThrow(
					UnsupportedEnvironmentError,
				);
			});
		});
	});
});
