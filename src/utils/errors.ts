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
