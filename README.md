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

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
