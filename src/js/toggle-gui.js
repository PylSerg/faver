import { state, refs, setState } from "./state.js";
import { runCommand } from "./run-command.js";

function toggleGUI() {
	switch (state.GUI) {
		case "on":
			setState("GUI", "off");

			runCommand("gui off");

			break;

		case "off":
			setState("GUI", "on");

			runCommand("gui on");

			break;
	}
}

function changeGuiButton() {
	switch (state.GUI) {
		case "on":
			refs.guiSwitcher.style.color = "#ccc";
			refs.guiSwitcher.style.backgroundColor = "var(--main-color)";

			break;

		case "off":
			refs.guiSwitcher.style.color = "var(--main-color)";
			refs.guiSwitcher.style.backgroundColor = "var(--main-background-color)";

			break;
	}
}

export { toggleGUI, changeGuiButton };
