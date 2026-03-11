/**
 * Device orientation event type names.
 */
export enum OrientationEventType {
	Absolute = "deviceorientationabsolute",
	Standard = "deviceorientation",
}

/**
 * Returns true if the device supports DeviceOrientationEvent.
 */
export function isOrientationSupported(): boolean {
	return (
		typeof DeviceOrientationEvent !== "undefined" &&
		("ondeviceorientationabsolute" in globalThis || "ondeviceorientation" in globalThis)
	);
}

/**
 * Returns the most precise orientation event type available.
 */
export function resolveEventType(): OrientationEventType {
	return "ondeviceorientationabsolute" in globalThis
		? OrientationEventType.Absolute
		: OrientationEventType.Standard;
}
