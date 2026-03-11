import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { isOrientationSupported, resolveEventType, OrientationEventType } from "../../src/utils";
import { setup, teardown } from "../globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

describe("isOrientationSupported", () => {
	afterEach(teardown);

	it("returns true when ondeviceorientationabsolute is present", () => {
		setup();
		expect(isOrientationSupported()).toBe(true);
	});

	it("returns false when DeviceOrientationEvent is undefined", () => {
		expect(isOrientationSupported()).toBe(false);
	});

	it("returns false when ondeviceorientationabsolute is absent", () => {
		g.DeviceOrientationEvent = class {};
		expect(isOrientationSupported()).toBe(false);
		delete g.DeviceOrientationEvent;
	});

	it("returns true when ondeviceorientation is present", () => {
		setup({ absolute: false });
		expect(isOrientationSupported()).toBe(true);
	});
});

describe("resolveEventType", () => {
	beforeEach(() => setup());
	afterEach(teardown);

	it("returns Absolute", () => {
		expect(resolveEventType()).toBe(OrientationEventType.Absolute);
	});

	it("returns Standard when only ondeviceorientation is present", () => {
		teardown();
		setup({ absolute: false });
		expect(resolveEventType()).toBe(OrientationEventType.Standard);
	});

	it("prefers Absolute when both properties are present", () => {
		g.ondeviceorientation = null;
		expect(resolveEventType()).toBe(OrientationEventType.Absolute);
	});
});
