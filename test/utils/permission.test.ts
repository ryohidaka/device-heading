import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
	isIOSPermissionRequired,
	PermissionDeniedError,
	PermissionRequestFailedError,
	requestOrientationPermission,
	UnknownPermissionStateError,
	UnsupportedEnvironmentError,
} from "../../src/utils";
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

describe("requestOrientationPermission", () => {
	beforeEach(() => setup());
	afterEach(teardown);

	it("rejects with UnsupportedEnvironmentError when window is undefined", async () => {
		delete g.window;
		await expect(requestOrientationPermission()).rejects.toBeInstanceOf(
			UnsupportedEnvironmentError,
		);
	});

	it("rejects with UnsupportedEnvironmentError when DeviceOrientationEvent is undefined", async () => {
		delete g.DeviceOrientationEvent;
		await expect(requestOrientationPermission()).rejects.toBeInstanceOf(
			UnsupportedEnvironmentError,
		);
	});

	it("returns true when requestPermission is absent (non-iOS)", async () => {
		expect(await requestOrientationPermission()).toBe(true);
	});

	it("returns true when requestPermission resolves to 'granted'", async () => {
		g.DeviceOrientationEvent = { requestPermission: async () => "granted" };
		expect(await requestOrientationPermission()).toBe(true);
	});

	it("rejects with PermissionDeniedError when resolves to 'denied'", async () => {
		g.DeviceOrientationEvent = { requestPermission: async () => "denied" };
		await expect(requestOrientationPermission()).rejects.toBeInstanceOf(PermissionDeniedError);
	});

	it("rejects with UnknownPermissionStateError for unrecognised state", async () => {
		g.DeviceOrientationEvent = { requestPermission: async () => "prompt" };
		await expect(requestOrientationPermission()).rejects.toBeInstanceOf(
			UnknownPermissionStateError,
		);
	});

	it("re-throws Error instances from requestPermission", async () => {
		const original = new Error("native error");
		g.DeviceOrientationEvent = {
			requestPermission: () => Promise.reject(original),
		};
		await expect(requestOrientationPermission()).rejects.toBe(original);
	});

	it("rejects with PermissionRequestFailedError when a non-Error is thrown", async () => {
		g.DeviceOrientationEvent = {
			requestPermission: () => Promise.reject("oops"),
		};
		await expect(requestOrientationPermission()).rejects.toBeInstanceOf(
			PermissionRequestFailedError,
		);
	});
});
