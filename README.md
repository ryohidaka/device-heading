# device-heading

[![NPM Version](https://img.shields.io/npm/v/device-heading?logo=npm)](https://www.npmjs.com/package/device-heading)
[![Built with Bun](https://img.shields.io/badge/Built_with-Bun-fbf0df?logo=bun&labelColor=212121)](https://bun.com)
[![CI](https://github.com/ryohidaka/device-heading/actions/workflows/ci.yml/badge.svg)](https://github.com/ryohidaka/device-heading/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

TypeScript library to get and track device heading.

> [!NOTE]
> Requires HTTPS or localhost to access motion sensors.
>
> On iOS Safari, `requestIOSPermission()` must be called inside a user gesture
> handler (e.g., a button click).
>
> Heading accuracy depends on the device's magnetometer and surrounding
> environment.

## ✨ Features

- ✅ Simple API to get heading once or watch continuously
- 📱 Works with iOS and Android (with built-in permission helper for iOS)
- ⚡ Zero dependencies

## Demo

🔗 **Live Demo:** https://ryohidaka.github.io/device-heading/

> [!TIP]
> Access from a smartphone to see real-time compass heading updates as you move your device.

## 📦 Installation

```bash
npm i device-heading
```

## 🚀 Usage

### Initialize

```typescript
import { DeviceHeading } from "device-heading";

const compass = new DeviceHeading();

if (compass.isSupported()) {
	console.log("DeviceOrientationEvent API is supported on this device.");
} else {
	console.error("DeviceOrientationEvent API is not supported on this device.");
}
```

### Get a single heading value

```typescript
import { DeviceHeading } from "device-heading";

const compass = new DeviceHeading();

const heading = await compass.once();
console.log("Current heading:", heading);
```

### Round heading values

```typescript
import { DeviceHeading } from "device-heading";

// Round to 1 decimal place (e.g., 180.5)
const compass = new DeviceHeading({ precision: 1 });

const heading = await compass.once();
console.log("Current heading::", heading);
```

### Observe heading changes in real time

```typescript
import { DeviceHeading } from "device-heading";

const compass = new DeviceHeading();

compass.start((heading) => {
	console.log("Heading:", heading);
});

// Stop watching when done
setTimeout(() => {
	compass.stop();
	console.log("Stopped observing.");
}, 5000);
```

### Check iOS permission

```typescript
import { DeviceHeading } from "device-heading";

const compass = new DeviceHeading();

if (!(await compass.hasIOSPermission())) {
	// show permission request UI
}
```

### Request iOS permission

On iOS Safari, the user must explicitly grant permission to access motion data.
Call this inside a user gesture handler (e.g., a button click).

```typescript
import { DeviceHeading } from "device-heading";

const compass = new DeviceHeading();

button.addEventListener("click", async () => {
	const granted = await compass.requestIOSPermission();

	if (granted) {
		console.log("Permission granted");
	} else {
		console.log("Permission denied");
	}
});
```

## 🧠 API Reference

### `new DeviceHeading(options?)`

Creates a new compass instance.

| Option      | Type     | Default     | Description                                                                    |
| ----------- | -------- | ----------- | ------------------------------------------------------------------------------ |
| `precision` | `number` | `undefined` | Decimal places to round heading values to. If omitted, no rounding is applied. |

### `isSupported(): boolean`

Returns `true` if the current environment supports `DeviceOrientationEvent`.

### `once(): Promise<number>`

Returns the current heading once (in degrees, 0–360°).

### `start(callback: (heading: number) => void): void`

Starts watching for heading updates. Calls `callback` with the latest heading on each change.

### `stop(): void`

Stops watching for heading updates.

### `hasIOSPermission(): Promise<boolean>`

Returns `true` if the `DeviceOrientationEvent` permission is granted on iOS 13+.
On non-iOS devices, always returns `true`.

### `requestIOSPermission(): Promise<boolean>`

Requests motion permission on iOS 13+. Must be called inside a user gesture handler (e.g., a button click).
On non-iOS devices, returns `true` immediately.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
