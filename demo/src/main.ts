import { DeviceHeading } from "../../src";

const compass = new DeviceHeading();

// ── API Support ───────────────────────────────────────────────────────────────

const supported = compass.isSupported();
document.getElementById("support")!.textContent = supported ? "✅ Supported" : "❌ Not supported";

// ── iOS Permission ────────────────────────────────────────────────────────────
// On load, probe with once(). If a heading is returned the sensor is already
// accessible and the permission button is not needed. Otherwise show it.

const sectionPermission = document.getElementById("section-permission") as HTMLElement;
const permissionStatus = document.getElementById("permission-status")!;
const btnPermission = document.getElementById("btn-permission") as HTMLButtonElement;

sectionPermission.hidden = await compass.hasIOSPermission();

btnPermission.addEventListener("click", async () => {
	try {
		await compass.requestIOSPermission();
		permissionStatus.textContent = "✅ Permission granted";
		sectionPermission.hidden = true;
	} catch (err) {
		permissionStatus.textContent = `❌ ${(err as Error).message}`;
	}
});

// ── Read Once ─────────────────────────────────────────────────────────────────

const onceValue = document.getElementById("once-value")!;
const btnOnce = document.getElementById("btn-once") as HTMLButtonElement;

btnOnce.addEventListener("click", async () => {
	try {
		const heading = await compass.once();
		onceValue.textContent = `${heading.toFixed(1)}°`;
	} catch (err) {
		onceValue.textContent = `Error: ${(err as Error).message}`;
	}
});

// ── Watch ─────────────────────────────────────────────────────────────────────

const watchValue = document.getElementById("watch-value")!;
const btnStart = document.getElementById("btn-start") as HTMLButtonElement;
const btnStop = document.getElementById("btn-stop") as HTMLButtonElement;

btnStart.addEventListener("click", () => {
	compass.start((heading) => {
		watchValue.textContent = `${heading.toFixed(1)}°`;
	});
	btnStart.disabled = true;
	btnStop.disabled = false;
});

btnStop.addEventListener("click", () => {
	compass.stop();
	btnStart.disabled = false;
	btnStop.disabled = true;
});
