const keyShortcuts = [">", ":", '"', "{", "}", "L"];

let refConsole;

function initRefsForConsoleLineCleaner(Console) {
	refConsole = Console;
}

function clearConsoleLineFromKeyShortcuts() {
	setInterval(() => {
		keyShortcuts.map((cmd) => {
			if (refConsole.value === cmd) {
				refConsole.value = "";

				return;
			}
		});
	}, 1000);
}

export { clearConsoleLineFromKeyShortcuts, initRefsForConsoleLineCleaner };
