import { state, refs, setState } from "../state.js";
import { runCommand } from "../run-command.js";
import { showConsole, hideConsole } from "../console-controller.js";

export default function keyShortcutsEventsListeners() {
	document.addEventListener("keydown", (e) => {
		if (e.key === ":") {
			runCommand("og");

			return;
		}

		if (e.key === '"') {
			runCommand("cg");

			return;
		}

		if (e.key === "{") {
			runCommand("hg");

			return;
		}

		if (e.key === "}") {
			runCommand("sg");

			return;
		}

		if (e.key === "L") {
			runCommand("l");

			return;
		}

		if (e.key === "?") {
			runCommand("/");

			return;
		}

		if (e.key === ">") {
			if (!state.isConsoleActive) {
				showConsole();

				setState(
					"focusOnConsole",
					setInterval(() => {
						if (!state.isItMobile) refs.console.focus();
					}, 1000),
				);

				return;
			} else {
				hideConsole();

				clearInterval(state.focusOnConsole);

				if (state.isAllPhotosShow) {
					refs.currentPhoto.focus();
				} else {
					refs.gallery.focus();
				}

				return;
			}
		}
	});
}
