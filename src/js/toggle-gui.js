let GUI;
let runCommand;

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

export { toggleGUI, exportToToggleGUI };
