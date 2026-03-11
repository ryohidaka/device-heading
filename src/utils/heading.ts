import { HeadingUnavailableError } from ".";

interface WebKitDeviceOrientationEvent extends DeviceOrientationEvent {
	webkitCompassHeading?: number;
}

/**
 * Converts degrees to radians.
 */
function degToRad(deg: number): number {
	return (deg * Math.PI) / 180;
}

/**
 * Rounds heading to the given decimal places.
 * If `precision` is omitted, returns heading as-is.
 */
function applyPrecision(heading: number, precision: number | undefined): number {
	if (precision === undefined) return heading;
	const factor = 10 ** precision;
	return Math.round(heading * factor) / factor;
}

/**
 * Derives compass heading (0–360°) from absolute alpha/beta/gamma.
 */
function computeHeadingFromAngles(event: DeviceOrientationEvent): number {
	const { alpha, beta, gamma, absolute } = event;

	if (
		typeof alpha !== "number" ||
		typeof beta !== "number" ||
		typeof gamma !== "number" ||
		!Number.isFinite(alpha) ||
		!Number.isFinite(beta) ||
		!Number.isFinite(gamma) ||
		!absolute
	) {
		throw new HeadingUnavailableError();
	}

	const radX = degToRad(beta);
	const radY = degToRad(gamma);
	const radZ = degToRad(alpha);

	const cosY = Math.cos(radY);
	const cosZ = Math.cos(radZ);
	const sinX = Math.sin(radX);
	const sinY = Math.sin(radY);
	const sinZ = Math.sin(radZ);

	const vx = -cosZ * sinY - sinZ * sinX * cosY;
	const vy = -sinZ * sinY + cosZ * sinX * cosY;

	const heading = Math.atan2(vx, vy);
	return ((heading < 0 ? heading + 2 * Math.PI : heading) * 180) / Math.PI || 0;
}

/**
 * Returns compass heading (0–360°) from a DeviceOrientationEvent.
 * Uses `webkitCompassHeading` on iOS Safari; falls back to absolute angles elsewhere.
 * @param event - DeviceOrientationEvent
 * @param precision - Decimal places to round to. If omitted, no rounding is applied.
 * @throws {HeadingUnavailableError}
 */
export function resolveHeading(event: WebKitDeviceOrientationEvent, precision?: number): number {
	if (!event) throw new HeadingUnavailableError();

	if (typeof event.webkitCompassHeading === "number") {
		return applyPrecision(event.webkitCompassHeading, precision);
	}

	return applyPrecision(computeHeadingFromAngles(event), precision);
}
