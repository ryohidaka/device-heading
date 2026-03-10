import { isOrientationSupported } from "./utils";

/**
 * Compass heading from the DeviceOrientationEvent API.
 */
export class DeviceHeading {
	private readonly supported: boolean;

	constructor() {
		this.supported = isOrientationSupported();
	}

	/**
	 * Returns true if the DeviceOrientationEvent API is available on this device.
	 *
	 * @example
	 * ```ts
	 * import { DeviceHeading } from "device-heading"
	 *
	 * const compass = new DeviceHeading();
	 * if (!compass.isSupported()) {
	 *   console.error("DeviceOrientationEvent is not supported");
	 * }
	 * ```
	 */
	isSupported(): boolean {
		return this.supported;
	}
}
