let refAccessInput;
let refAccessText;
let refAccessBlock;
let refConsole;

let GUI;
let mobile;
let focusOnConsole;

let runCommand;

function initRefsForOpenAccess(AccessInput, AccessText, AccessBlock, Console) {
	refAccessInput = AccessInput;
	refAccessText = AccessText;
	refAccessBlock = AccessBlock;
	refConsole = Console;
}

function exportToOpenAccess(guiStatus, isMobile, consoleFocus, runCommandFunction) {
	GUI = guiStatus;
	mobile = isMobile;
	focusOnConsole = consoleFocus;

	runCommand = runCommandFunction;
}

function openAccess() {
	refAccessInput.remove();

	refAccessText.innerHTML = "ACCESS ALLOWED";
	refAccessText.style.color = "#0a0";
	refAccessText.style.borderColor = "#0a0";

	setTimeout(() => {
		refAccessBlock.remove();

		if (GUI === "on") {
			runCommand("gui on");

			return;
		}

		if (GUI === "off") {
			runCommand("gui off");

			focusOnConsole = setInterval(() => {
				if (!mobile) refConsole.focus();
			}, 1000);
		}
	}, 1000);
}

export { openAccess, initRefsForOpenAccess, exportToOpenAccess };
