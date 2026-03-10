import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import { DeviceHeading } from "../src";
import { setup, teardown } from "./globals";

describe("DeviceHeading", () => {
	describe("Supported", () => {
		beforeEach(setup);
		afterEach(teardown);

		describe("isSupported", () => {
			it("returns true when supported", () => {
				setup();
				expect(new DeviceHeading().isSupported()).toBe(true);
			});
		});
	});

	describe("Unsupported", () => {
		describe("isSupported", () => {
			it("returns false when unsupported", () => {
				expect(new DeviceHeading().isSupported()).toBe(false);
			});
		});
	});
});
