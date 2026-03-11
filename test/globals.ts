// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

const listeners = new Map<string, Set<EventListener>>();

export function emit(
	type: string,
	event: Partial<DeviceOrientationEvent> & { webkitCompassHeading?: number },
): void {
	listeners.get(type)?.forEach((l) => l(event as unknown as Event));
}

export function listenerCount(type: string): number {
	return listeners.get(type)?.size ?? 0;
}

let _addEventListener: typeof globalThis.addEventListener;
let _removeEventListener: typeof globalThis.removeEventListener;

/**
 * Patch globalThis to simulate a browser that supports DeviceOrientationEvent.
 */
export function setup(opts: { absolute?: boolean } = { absolute: true }): void {
	listeners.clear();
	_addEventListener = globalThis.addEventListener;
	_removeEventListener = globalThis.removeEventListener;

	g.DeviceOrientationEvent = {};
	g.window = globalThis;
	if (opts.absolute) {
		g.ondeviceorientationabsolute = null;
		delete g.ondeviceorientation;
	} else {
		g.ondeviceorientation = null;
		delete g.ondeviceorientationabsolute;
	}

	g.addEventListener = (type: string, listener: EventListener) => {
		if (!listeners.has(type)) listeners.set(type, new Set());
		listeners.get(type)!.add(listener);
	};
	g.removeEventListener = (type: string, listener: EventListener) => {
		listeners.get(type)?.delete(listener);
	};
}

/**
 * Restore all patched globals.
 */
export function teardown(): void {
	delete g.DeviceOrientationEvent;
	delete g.window;
	delete g.ondeviceorientationabsolute;
	delete g.ondeviceorientation;

	globalThis.addEventListener = _addEventListener;
	globalThis.removeEventListener = _removeEventListener;
}

export function makeEvent(
	overrides: Partial<DeviceOrientationEvent> & { webkitCompassHeading?: number } = {},
): DeviceOrientationEvent & { webkitCompassHeading?: number } {
	return { alpha: 0, beta: 0, gamma: 0, absolute: true, ...overrides } as DeviceOrientationEvent & {
		webkitCompassHeading?: number;
	};
}
