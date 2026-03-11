import {
	isOrientationSupported,
	OrientationEventType,
	resolveEventType,
	resolveHeading,
	UnsupportedEnvironmentError,
} from "./utils";

export interface DeviceHeadingOptions {
	/**
	 * Number of decimal places to round heading values to.
	 * If omitted, no rounding is applied.
	 * @example precision: 1 → 180.5 / precision: 0 → 181
	 */
	precision?: number;
}

/**
 * Compass heading from the DeviceOrientationEvent API.
 */
export class DeviceHeading {
	private readonly supported: boolean;
	private readonly eventType: OrientationEventType;
	private readonly precision: number | undefined;
	private listener: ((event: DeviceOrientationEvent) => void) | null = null;

	constructor(options: DeviceHeadingOptions = {}) {
		this.supported = isOrientationSupported();
		this.eventType = resolveEventType();
		this.precision = options.precision;
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

	/**
	 * Returns the next compass heading (0–360°) as a one-shot Promise.
	 *
	 * @returns Heading in degrees, rounded if `precision` is set
	 * @throws {UnsupportedEnvironmentError} if the API is unavailable
	 * @example
	 * ```ts
	 * import { DeviceHeading } from "device-heading"
	 *
	 * const compass = new DeviceHeading({ precision: 1 });
	 * const heading = await compass.once();
	 * ```
	 */
	once(): Promise<number> {
		if (!this.supported) throw new UnsupportedEnvironmentError();

		return new Promise((resolve) => {
			const handler = (event: DeviceOrientationEvent): void => {
				globalThis.removeEventListener(this.eventType, handler as EventListener, true);
				resolve(resolveHeading(event, this.precision));
			};

			globalThis.addEventListener(this.eventType, handler as EventListener, true);
		});
	}

	/**
	 * Starts continuous compass heading updates.
	 *
	 * @param callback - Called with heading in degrees (0–360°), rounded if `precision` is set
	 * @throws {UnsupportedEnvironmentError} if the API is unavailable
	 * @example
	 * ```ts
	 * import { DeviceHeading } from "device-heading"
	 *
	 * const compass = new DeviceHeading({ precision: 1 });
	 * compass.start((heading) => console.log(heading));
	 * ```
	 */
	start(callback: (heading: number) => void): void {
		if (!this.supported) throw new UnsupportedEnvironmentError();
		if (this.listener !== null) return;

		this.listener = (event: DeviceOrientationEvent): void => {
			callback(resolveHeading(event, this.precision));
		};

		globalThis.addEventListener(this.eventType, this.listener as EventListener, true);
	}

	/**
	 * Stops continuous compass heading updates.
	 *
	 * @example
	 * ```ts
	 * import { DeviceHeading } from "device-heading"
	 *
	 * const compass = new DeviceHeading({ precision: 1 });
	 * compass.stop();
	 * ```
	 */
	stop(): void {
		if (this.listener === null) return;

		globalThis.removeEventListener(this.eventType, this.listener as EventListener, true);
		this.listener = null;
	}
}
