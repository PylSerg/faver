let refGuiSwitcher;

let GUI;
let runCommand;

function initRefsForChangeGuiButton(GuiSwitcher) {
	refGuiSwitcher = GuiSwitcher;
}

function exportToToggleGUI(statusGUI, runCommandFunction) {
	GUI = statusGUI;
	runCommand = runCommandFunction;
}

function toggleGUI() {
	switch (GUI) {
		case "on":
			GUI = "off";

			runCommand("gui off");

			break;

		case "off":
			GUI = "on";

			runCommand("gui on");

			break;
	}
}

function changeGuiButton() {
	switch (GUI) {
		case "on":
			refGuiSwitcher.style.color = "#ccc";
			refGuiSwitcher.style.backgroundColor = "var(--main-color)";

			break;

		case "off":
			refGuiSwitcher.style.color = "var(--main-color)";
			refGuiSwitcher.style.backgroundColor = "var(--main-background-color)";

			break;
	}
}

export { toggleGUI, changeGuiButton, initRefsForChangeGuiButton, exportToToggleGUI };
