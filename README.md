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

## 🧠 API Reference

### `new DeviceHeading()`

Creates a new compass instance.

### `isSupported(): boolean`

Returns `true` if the current environment supports `DeviceOrientationEvent`.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
