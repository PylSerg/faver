let refConsoleLog;
let refConsole;
let refConsoleBlock;

let gallery;

let setState;

function initRefsForConsoleController(ConsoleLog, Console, ConsoleBlock) {
	refConsoleLog = ConsoleLog;
	refConsole = Console;
	refConsoleBlock = ConsoleBlock;
}

function exportToConsoleController(galleryState, setStateFunction) {
	gallery = galleryState;
	setState = setStateFunction;
}

function showLog() {
	refConsoleLog.style.visibility = "visible";
	refConsoleLog.scrollTop = refConsoleLog.scrollHeight;

	setState("isLoggerActive", true);

	if (gallery === "opened") refConsole.style.backgroundColor = "#000";
}

function hideLog() {
	refConsoleLog.style.visibility = "hidden";

	setState("isLoggerActive", false);

	if (gallery === "opened") refConsole.style.backgroundColor = "transparent";
}

function showConsole() {
	setState("isConsoleActive", true);

	refConsoleBlock.style.display = "block";

	showLog();

	return;
}

function hideConsole() {
	setState("isConsoleActive", false);

	refConsoleBlock.style.display = "none";

	hideLog();

	return;
}

export { showLog, hideLog, showConsole, hideConsole, initRefsForConsoleController, exportToConsoleController };
