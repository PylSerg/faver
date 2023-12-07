import { state, refs, setState } from "./state.js";
import { runCommand } from "./run-command.js";
import { clearConsoleLineFromKeyShortcuts } from "./key-shortcuts.js";

function openAccess() {
	refs.accessInput.remove();

	refs.accessText.innerHTML = "ACCESS ALLOWED";
	refs.accessText.style.color = "#0a0";
	refs.accessText.style.borderColor = "#0a0";

	clearConsoleLineFromKeyShortcuts();

	setTimeout(() => {
		refs.accessBlock.remove();

		if (state.GUI === "on") {
			runCommand("gui on");

			return;
		}

		if (state.GUI === "off") {
			runCommand("gui off");

			setState(
				"focusOnConsole",
				setInterval(() => {
					if (!state.isItMobile) refs.console.focus();
				}, 1000),
			);
		}
	}, 1000);
}

function closeAccess() {
	refs.accessText.innerHTML = "ACCESS DENIED";
	refs.accessText.style.color = "#a00";
	refs.accessText.style.borderColor = "#a00";
	refs.accessText.setAttribute("class", "access-text access-text--error");

	refs.accessInput.setAttribute("type", "password");
	refs.accessInput.setAttribute("class", "access-input");
	refs.accessInput.value = "";

	setTimeout(() => {
		refs.accessText.setAttribute("class", "access-text");
	}, 1100);
}

export { openAccess, closeAccess };
