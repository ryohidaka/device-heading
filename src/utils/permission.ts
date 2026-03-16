/**
 * Returns true if the platform requires an explicit permission request
 * for DeviceOrientationEvent (i.e. iOS 13+).
 */
export function isIOSPermissionRequired(): boolean {
	return (
		typeof DeviceOrientationEvent !== "undefined" && "requestPermission" in DeviceOrientationEvent
	);
}
