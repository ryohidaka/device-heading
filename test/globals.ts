// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

/**
 * Patch globalThis to simulate a browser that supports DeviceOrientationEvent.
 */
export function setup(): void {
	g.DeviceOrientationEvent = {};
	g.window = globalThis;
	g.ondeviceorientationabsolute = null;
	delete g.ondeviceorientation;
}

/**
 * Restore all patched globals.
 */
export function teardown(): void {
	delete g.DeviceOrientationEvent;
	delete g.window;
	delete g.ondeviceorientationabsolute;
}
