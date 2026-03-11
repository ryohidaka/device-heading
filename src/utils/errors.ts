/**
 * Base class for all DeviceHeading errors.
 */
export class DeviceHeadingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = new.target.name;
	}
}

/**
 * Thrown when DeviceOrientationEvent is unavailable in this environment.
 */
export class UnsupportedEnvironmentError extends DeviceHeadingError {
	constructor() {
		super("DeviceOrientationEvent is not supported in this environment");
	}
}

/**
 * Thrown when absolute alpha/beta/gamma values are unavailable.
 */
export class HeadingUnavailableError extends DeviceHeadingError {
	constructor() {
		super("Cannot determine compass heading: absolute alpha/beta/gamma not available");
	}
}

/**
 * Thrown when the user denies the permission request.
 */
export class PermissionDeniedError extends DeviceHeadingError {
	constructor() {
		super("Permission denied by user");
	}
}

/**
 * Thrown when the permission API returns an unrecognised state.
 */
export class UnknownPermissionStateError extends DeviceHeadingError {
	constructor(state: string) {
		super(`Unknown permission state: "${state}"`);
	}
}

/**
 * Thrown when the permission request fails unexpectedly.
 */
export class PermissionRequestFailedError extends DeviceHeadingError {
	constructor() {
		super("Failed to request iOS device orientation permission");
	}
}
