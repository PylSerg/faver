import { state, refs, setState } from "./state.js";

function showLog() {
	refs.consoleLog.style.visibility = "visible";
	refs.consoleLog.scrollTop = refs.consoleLog.scrollHeight;

	setState("isLoggerActive", true);

	if (state.isGalleryOpen) refs.console.style.backgroundColor = "#000";
}

function hideLog() {
	refs.consoleLog.style.visibility = "hidden";

	setState("isLoggerActive", false);

	if (state.isGalleryOpen) refs.console.style.backgroundColor = "transparent";
}

function showConsole() {
	setState("isConsoleActive", true);

	refs.consoleBlock.style.display = "block";

	showLog();
}

function hideConsole() {
	setState("isConsoleActive", false);

	refs.consoleBlock.style.display = "none";

	hideLog();
}

export { showLog, hideLog, showConsole, hideConsole };
