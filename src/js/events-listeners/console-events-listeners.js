import { refs } from "../state.js";
import { runCommand } from "../run-command.js";

export default function consoleEventsListeners() {
	refs.console.addEventListener("keydown", (e) => {
		if (e.key === "Enter") runCommand(refs.console.value);
	});

	document.addEventListener("auxclick", (e) => {
		if (e.button === 1) {
			runCommand("/");
		}
	});
}
