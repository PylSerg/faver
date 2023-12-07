import { refs } from "../state.js";
import { toggleGUI } from "../toggle-gui.js";

export default function toggleGuiEventsListeners() {
	refs.guiSwitcher.addEventListener("click", () => toggleGUI());
}
