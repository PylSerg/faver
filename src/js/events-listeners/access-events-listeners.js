import { refs } from "../state.js";
import { autoSendingPassword } from "../auto-sending-password.js";

export default function accessEventsListeners() {
	refs.accessInput.addEventListener("input", (e) => autoSendingPassword(e.currentTarget.value));
}
