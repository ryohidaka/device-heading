import {
	PermissionDeniedError,
	PermissionRequestFailedError,
	UnknownPermissionStateError,
	UnsupportedEnvironmentError,
} from ".";

interface IOSDeviceOrientationEvent {
	requestPermission?: () => Promise<"granted" | "denied">;
}

/**
 * Returns true if the platform requires an explicit permission request
 * for DeviceOrientationEvent (i.e. iOS 13+).
 */
export function isIOSPermissionRequired(): boolean {
	return (
		typeof DeviceOrientationEvent !== "undefined" && "requestPermission" in DeviceOrientationEvent
	);
}

/**
 * Requests DeviceOrientationEvent permission on iOS.
 * Must be invoked from a user gesture (e.g. tap handler).
 * Resolves to `true` immediately on platforms that don't require permission.
 * @throws {UnsupportedEnvironmentError | PermissionDeniedError | UnknownPermissionStateError | PermissionRequestFailedError}
 */
export async function requestOrientationPermission(): Promise<boolean> {
	if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
		throw new UnsupportedEnvironmentError();
	}

	const { requestPermission } = DeviceOrientationEvent as unknown as IOSDeviceOrientationEvent;

	if (typeof requestPermission !== "function") return true;

	try {
		const state = await requestPermission();

		if (state === "granted") return true;
		if (state === "denied") throw new PermissionDeniedError();

		throw new UnknownPermissionStateError(state);
	} catch (err) {
		if (err instanceof Error) throw err;
		throw new PermissionRequestFailedError();
	}
}
