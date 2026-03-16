# device-heading

TypeScript library to get and track device heading

## Installation

```bash
bun add device-heading
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

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
