import { state, refs, favorite, setState } from "./state.js";
import { DATABASE } from "./urls.js";
import { changeGuiButton } from "./toggle-gui.js";
import { createCards, createCardsWithoutGUI } from "./create-cards.js";
import { openAllUserProfiles, openAllUserStories, openAllUserPages, openFacebookStories, openFacebookProfile, openInstagramStories, openInstagramProfile } from "./open-user-pages.js";
import { openGallery, closeGallery } from "./gallery.js";
import { showLog, hideLog, showConsole, hideConsole } from "./console-controller.js";
import { faverLog } from "./faver-log.js";

function runCommand(cmd) {
	let commandArguments = [];

	commandArguments = cmd.split(" ");

	const user = favorite[`USER_${commandArguments[1]}`];
	const dUser = favorite[`${state.defaultUser}`];

	const firstArgument = commandArguments[0];
	const secondArgument = commandArguments[1];

	switch (firstArgument) {
		/* Opens Database */
		case "open-database":
		case "odb":
			faverLog(`Opening database...`, cmd);

			window.open(DATABASE, "_blank");

			break;

		/* Opens all profiles */
		case "open-all-profiles":
		case "oap":
			if (secondArgument === undefined) {
				faverLog(`Opening all profiles of ${dUser.NAME}...`, cmd);

				openAllUserProfiles({ fbp: dUser.FB_PROF_ID, inst: dUser.INST_ID });

				break;
			}

			faverLog(`Opening all profiles of ${user.NAME}...`, cmd);

			openAllUserProfiles({ fbp: user.FB_PROF_ID, inst: user.INST_ID });

			break;

		/* Opens all stories */
		case "open-all-stories":
		case "oas":
			if (secondArgument === undefined) {
				faverLog(`Opening all stories of ${dUser.NAME}...`, cmd);

				openAllUserStories({ fbs: dUser.FB_STOR_ID, inst: dUser.INST_ID });

				break;
			}

			faverLog(`Opening all stories of ${user.NAME}...`, cmd);

			openAllUserStories({ fbs: user.FB_STOR_ID, inst: user.INST_ID });

			break;

		/* Opens profile */
		case "open-facebook-profile":
		case "ofp":
			if (secondArgument === undefined) {
				faverLog(`Opening Facebook profile of ${dUser.NAME}...`, cmd);

				openFacebookProfile(dUser.FB_PROF_ID);

				break;
			}

			faverLog(`Opening Facebook profile of ${user.NAME}...`, cmd);

			openFacebookProfile(user.FB_PROF_ID);

			break;

		case "open-instagram-profile":
		case "oip":
			if (secondArgument === undefined) {
				faverLog(`Opening Instagram profile of ${dUser.NAME}...`, cmd);

				openInstagramProfile(dUser.INST_ID);

				break;
			}

			faverLog(`Opening Instagram profile of ${user.NAME}...`, cmd);

			openInstagramProfile(user.INST_ID);

			break;

		/* Opens stories */
		case "open-facebook-stories":
		case "ofs":
			if (secondArgument === undefined) {
				faverLog(`Opening Facebook stories of ${dUser.NAME}...`, cmd);

				openFacebookStories(dUser.FB_STOR_ID);

				break;
			}

			faverLog(`Opening Facebook stories of ${user.NAME}...`, cmd);

			openFacebookStories(user.FB_STOR_ID);

			break;

		case "open-instagram-stories":
		case "ois":
			if (secondArgument === undefined) {
				faverLog(`Opening Instagram stories of ${dUser.NAME}...`, cmd);

				openInstagramStories(dUser.INST_ID);

				break;
			}

			faverLog(`Opening Instagram stories of ${user.NAME}...`, cmd);

			openInstagramStories(user.INST_ID);

			break;

		/* Opens all */
		case "open-all-user-pages":
		case "oa":
			if (secondArgument === undefined) {
				faverLog(`Opening all pages of ${dUser.NAME}...`, cmd);

				openAllUserPages({ fbp: dUser.FB_PROF_ID, fbs: dUser.FB_STOR_ID, inst: dUser.INST_ID });

				break;
			}

			faverLog(`Opening all pages of ${user.NAME}...`, cmd);

			openAllUserPages({ fbp: user.FB_PROF_ID, fbs: user.FB_STOR_ID, inst: user.INST_ID });

			break;

		/* Opens gallery */
		case "open-gallery":
		case "og":
			if (secondArgument === undefined) {
				faverLog(`Opening gallery of ${dUser.NAME}...`, cmd);

				openGallery(state.defaultUser);

				break;
			}

			faverLog(`Opening gallery of ${user.NAME}...`, cmd);

			openGallery(`USER_${secondArgument}`);

			break;

		/* Closes gallery */
		case "close-gallery":
		case "cg":
			faverLog(`Closing gallery...`, cmd);

			closeGallery();

			break;

		/* Shows\hides gallery */
		case "show-gallery":
		case "sg":
			if (!state.isGalleryOpen) {
				faverLog(`E: Gallery is closed!`, cmd);

				break;
			}

			refs.gallery.style.visibility = "visible";

			faverLog(`Gallery is show`, cmd);

			hideLog();

			break;

		case "hide-gallery":
		case "hg":
			if (!state.isGalleryOpen) {
				faverLog(`E: Gallery is closed!`, cmd);

				break;
			}

			refs.gallery.style.visibility = "hidden";

			faverLog(`Gallery is hide`, cmd);

			showLog();

			break;

		/* Shows birthday */
		case "print-user-birthday":
		case "bd":
			if (secondArgument === undefined) {
				faverLog(`Birthday of ${dUser.NAME}: ${dUser.BIRTHDAY}`, cmd);

				break;
			}

			faverLog(`Birthday of ${user.NAME}: ${user.BIRTHDAY}`, cmd);

			break;

		/* Photo quantity */
		case "print-photo-quantity":
		case "phq":
			if (secondArgument === undefined) {
				faverLog(`${dUser.PHOTOS.length} photos of ${dUser.NAME}`, cmd);

				break;
			}

			faverLog(`${user.PHOTOS.length} photos of ${user.NAME}`, cmd);

			break;

		/* Service commands */

		// Off\On GUI
		case "gui":
			if (secondArgument === "on") {
				setState("GUI", "on");

				changeGuiButton();
				createCards();
				hideLog();
				hideConsole();

				localStorage.setItem("GUI", "on");

				faverLog(`GUI is on`, cmd);
			}

			if (secondArgument === "off") {
				setState("GUI", "off");

				changeGuiButton();
				createCardsWithoutGUI();
				showConsole();
				showLog();

				localStorage.setItem("GUI", "off");

				faverLog(`GUI is off`, cmd);
			}

			break;

		// Hides\shows log
		case "toggle-log":
		case "l":
			if (!state.isLoggerActive) {
				showLog();
			} else {
				hideLog();
			}

			break;

		// Clears log
		case "clear-log":
		case "c":
			refs.consoleLog.innerHTML = "";

			break;

		// Exit
		case "exit":
		case "/":
			location.reload();

			break;

		default:
			faverLog(`E: Command "${cmd}" not found`, cmd);
	}

	refs.console.value = "";
}

export { runCommand };
