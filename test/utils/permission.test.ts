import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { isIOSPermissionRequired } from "../../src/utils";
import { setup, teardown } from "../globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

describe("isIOSPermissionRequired", () => {
	beforeEach(() => setup());
	afterEach(teardown);

	it("returns false when DeviceOrientationEvent is undefined", () => {
		delete g.DeviceOrientationEvent;
		expect(isIOSPermissionRequired()).toBe(false);
	});

	it("returns false when requestPermission is absent (non-iOS)", () => {
		g.DeviceOrientationEvent = {};
		expect(isIOSPermissionRequired()).toBe(false);
	});

	it("returns true when requestPermission is present (iOS 13+)", () => {
		g.DeviceOrientationEvent = { requestPermission: async () => "granted" };
		expect(isIOSPermissionRequired()).toBe(true);
	});
});
