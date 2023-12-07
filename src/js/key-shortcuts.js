import { refs } from "./state.js";

const keyShortcuts = [">", ":", '"', "{", "}", "L"];

function clearConsoleLineFromKeyShortcuts() {
	setInterval(() => {
		keyShortcuts.map((cmd) => {
			if (refs.console.value === cmd) {
				refs.console.value = "";

				return;
			}
		});
	}, 1000);
}

export { clearConsoleLineFromKeyShortcuts };
