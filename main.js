import { autoSendingPassword, initRefsForAutoSendingPassword } from "./src/js/auto-sending-password.js";
import { getDatabaseURL, setDatabaseURL } from "./src/js/urls.js";
import { exportToCheckAccess } from "./src/js/check-access.js";
import { openAccess, initRefsForOpenAccess, exportToOpenAccess } from "./src/js/open-access.js";
import { initRefsForCloseAccess } from "./src/js/close-access.js";
import { createCards, createCardsWithoutGUI, initRefsForCardsCreator } from "./src/js/create-cards.js";
import { toggleGUI, changeGuiButton, initRefsForChangeGuiButton, exportToToggleGUI } from "./src/js/toggle-gui.js";
import { openAllUserProfiles, openAllUserStories, openAllUserPages, openFacebookStories, openFacebookProfile, openInstagramStories, openInstagramProfile } from "./src/js/open-user-pages.js";
import { clearConsoleLineFromKeyShortcuts, initRefsForConsoleLineCleaner } from "./src/js/key-shortcuts.js";
import { faverLog, initRefsForFaverLog } from "./src/js/faver-log.js";

const refAccessBlock = document.querySelector(".access-block");
const refAccessText = document.querySelector(".access-text");
const refAccessInput = document.querySelector("[data-input-password]");

const refGuiSwitcher = document.querySelector("[data-gui-switcher]");

const refFavorite = document.querySelector("#favorite");

const refGallery = document.querySelector(".gallery-block");
const refAllPhotos = document.querySelector("[data-all-photos]");

const refPhoto = document.querySelector("[data-photo]");
const refPrevPhotoButton = document.querySelector("[data-prev-photo]");
const refNextPhotoButton = document.querySelector("[data-next-photo]");
const refToggleAllPhotosButton = document.querySelector("[data-toggle-all-photos-button]");
const refZoomPhotoButton = document.querySelector("[data-zoom-photo-button]");
const refCloseGalleryButton = document.querySelector("[data-close-gallery-button]");

let refCurrentPhoto = document.querySelector("[data-empty]");

const refConsoleBlock = document.querySelector(".console-block");
const refConsoleLog = document.querySelector("[data-console-log]");
const refConsole = document.querySelector("[data-console]");

const favorite = {};

let mobile = window.navigator.userAgentData.mobile;
let focusOnConsole = "setInterval";

let GUI = localStorage.getItem("GUI") ?? "on";

let activeUser = "USER_1";
let defaultUser = "USER_1";

let gallery = "closed";
let isAllPhotosShow = false;
let zoom = false;
let photoCounter = 0;

let logger = false;
let isConsoleActive = false;

let touchstartX = 0;
let touchendX = 0;

initRefsForAutoSendingPassword(refAccessInput);
initRefsForFaverLog(refConsoleLog);
initRefsForConsoleLineCleaner(refConsole);
initRefsForCloseAccess(refAccessText, refAccessInput);

exportToCheckAccess(initialization);

clearConsoleLineFromKeyShortcuts();

faverLog("Starting Faver...", "start");

function initialization(data) {
	data.data.map((user) => {
		for (const userId in user) {
			favorite[userId] = {};

			for (const key in user[userId]) {
				favorite[userId][key] = user[userId][key];
			}
		}
	});

	setDatabaseURL(data.database);

	initRefsForCardsCreator(refFavorite);
	initRefsForOpenAccess(refAccessInput, refAccessText, refAccessBlock, refConsole);
	initRefsForChangeGuiButton(refGuiSwitcher);

	exportToOpenAccess(GUI, mobile, focusOnConsole, runCommand);
	exportToToggleGUI(GUI, runCommand);

	openAccess();
}

/*
	Gallery
*/
function openGallery(user) {
	if (gallery === "opened" && activeUser === user) {
		faverLog(`W: Gallery is already open! \nUse command "sg" to show gallery.`);

		return;
	}

	activeUser = user;
	gallery = "opened";
	photoCounter = 0;

	isConsoleActive = false;
	clearInterval(focusOnConsole);

	hideLog();
	viewAllPhotos();

	refGallery.style.visibility = "visible";
	refConsole.style.backgroundColor = "transparent";
	refGallery.style.display = "flex";

	showAllPhotos();

	for (const key in favorite) {
		const data = favorite[key];

		if (key === activeUser) {
			refPhoto.setAttribute("src", data.PHOTOS[photoCounter]);

			break;
		}
	}

	faverLog(`Gallery is opened`);
}

function changePhoto(action) {
	if (zoom) zoomPhoto();

	for (const key in favorite) {
		const user = favorite[key];

		if (key === activeUser) {
			if (action === "prev") {
				if (photoCounter === 0) {
					photoCounter = user.PHOTOS.length - 1;
				} else {
					photoCounter -= 1;
				}
			}

			if (action === "next") {
				if (photoCounter === user.PHOTOS.length - 1) {
					photoCounter = 0;
				} else {
					photoCounter += 1;
				}
			}

			refPhoto.setAttribute("src", user.PHOTOS[photoCounter]);
		}
	}
}

function viewAllPhotos() {
	refAllPhotos.innerHTML = "";

	favorite[activeUser].PHOTOS.map((photoURL) => {
		const photoPreviewBox = document.createElement("div");
		const photo = document.createElement("img");

		photo.setAttribute("id", `photo-${favorite[activeUser].PHOTOS.indexOf(photoURL)}`);
		photo.setAttribute("tabindex", favorite[activeUser].PHOTOS.indexOf(photoURL));

		photoPreviewBox.setAttribute("class", "photo-review-box");

		photo.setAttribute("class", "photo-preview");
		photo.setAttribute("src", photoURL);

		refAllPhotos.append(photoPreviewBox);
		photoPreviewBox.append(photo);
	});
}

function selectPhoto(indx) {
	photoCounter = indx;

	refPhoto.setAttribute("src", favorite[activeUser].PHOTOS[photoCounter]);

	hideAllPhotos();
}

function showAllPhotos() {
	isAllPhotosShow = true;

	refZoomPhotoButton.style.display = "none";
	refAllPhotos.style.display = "flex";
	refToggleAllPhotosButton.setAttribute("src", "src/images/photo.png");
	refPhoto.style.zIndex = "1";

	refCurrentPhoto = document.querySelector(`#photo-${photoCounter}`);

	refCurrentPhoto.focus();

	if (zoom) zoomPhoto();
}

function hideAllPhotos() {
	isAllPhotosShow = false;

	refZoomPhotoButton.style.display = "block";
	refAllPhotos.style.display = "none";
	refToggleAllPhotosButton.setAttribute("src", "src/images/gallery.png");
}

function toggleAllPhotos() {
	if (!isAllPhotosShow) {
		showAllPhotos();
		return;
	}

	if (isAllPhotosShow) {
		hideAllPhotos();
		return;
	}
}

function zoomPhoto() {
	if (!zoom) {
		refZoomPhotoButton.setAttribute("class", "zoom-photo-button zoom-photo-button--active");

		refPhoto.style.maxHeight = "10000px";
		refPhoto.style.position = "absolute";
		refPhoto.style.top = "0";
		refPhoto.style.zIndex = "100";
		refPhoto.style.cursor = "zoom-out";

		zoom = true;

		faverLog(`Zoom is on`);

		return;
	}

	if (zoom) {
		refZoomPhotoButton.setAttribute("class", "zoom-photo-button");
		refPhoto.style.cursor = "zoom-out";

		refPhoto.removeAttribute("style");

		zoom = false;

		faverLog(`Zoom is off`);

		return;
	}
}

function closeGallery() {
	refGallery.style.display = "none";
	refAllPhotos.style.display = "none";
	refConsole.style.backgroundColor = "#000";

	if (GUI === "off") showLog();

	gallery = "closed";
	isAllPhotosShow = false;
	activeUser = "";

	if (zoom) zoomPhoto();

	isConsoleActive = true;
	focusOnConsole = setInterval(() => {
		if (!mobile) refConsole.focus();
	}, 1000);

	faverLog(`Gallery is closed`);
}

/* 
	Console
*/

function showLog() {
	refConsoleLog.style.visibility = "visible";
	refConsoleLog.scrollTop = refConsoleLog.scrollHeight;

	logger = true;

	if (gallery === "opened") refConsole.style.backgroundColor = "#000";
}

function hideLog() {
	refConsoleLog.style.visibility = "hidden";

	logger = false;

	if (gallery === "opened") refConsole.style.backgroundColor = "transparent";
}

function showConsole() {
	isConsoleActive = true;

	refConsoleBlock.style.display = "block";

	showLog();

	return;
}

function hideConsole() {
	isConsoleActive = false;

	refConsoleBlock.style.display = "none";

	hideLog();

	return;
}

function runCommand(cmd) {
	let commandArguments = [];

	commandArguments = cmd.split(" ");

	const user = favorite[`USER_${commandArguments[1]}`];
	const dUser = favorite[`${defaultUser}`];

	const firstArgument = commandArguments[0];
	const secondArgument = commandArguments[1];

	switch (firstArgument) {
		/* Opens Database */
		case "open-database":
		case "odb":
			faverLog(`Opening database...`, cmd);

			window.open(getDatabaseURL(), "_blank");

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

				openGallery(defaultUser);

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
			if (gallery === "closed") {
				faverLog(`E: Gallery is closed!`, cmd);

				break;
			}

			refGallery.style.visibility = "visible";

			faverLog(`Gallery is show`, cmd);

			hideLog();

			break;

		case "hide-gallery":
		case "hg":
			if (gallery === "closed") {
				faverLog(`E: Gallery is closed!`, cmd);

				break;
			}

			refGallery.style.visibility = "hidden";

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
				GUI = "on";

				changeGuiButton();
				createCards(favorite);
				hideLog();
				hideConsole();

				localStorage.setItem("GUI", "on");

				faverLog(`GUI is on`, cmd);
			}

			if (secondArgument === "off") {
				GUI = "off";

				changeGuiButton();
				createCardsWithoutGUI(favorite);
				showConsole();
				showLog();

				localStorage.setItem("GUI", "off");

				faverLog(`GUI is off`, cmd);
			}

			break;

		// Hides\shows log
		case "toggle-log":
		case "l":
			if (!logger) {
				showLog();
			} else {
				hideLog();
			}

			break;

		// Clears log
		case "clear-log":
		case "c":
			refConsoleLog.innerHTML = "";

			break;

		// Exit
		case "exit":
		case "/":
			location.reload();

			break;

		default:
			faverLog(`E: Command "${cmd}" not found`, cmd);
	}

	refConsole.value = "";
}

function checkDirection() {
	if (zoom) return;

	if (touchendX < touchstartX) changePhoto("next");
	if (touchendX > touchstartX) changePhoto("prev");
}

/*
	Events listeners
*/

refAccessInput.addEventListener("input", (e) => autoSendingPassword(e.currentTarget.value));

refGuiSwitcher.addEventListener("click", () => toggleGUI());

refFavorite.addEventListener("click", (e) => {
	if (!e.target.attributes["action"]) return;

	const action = e.target.attributes["action"].value;
	const userId = e.target.attributes.key.value;
	const user = favorite[userId];

	if (action === "open-gallery") {
		openGallery(userId);

		return;
	}

	if (action === "open-all-profiles") {
		openAllUserProfiles({ fbp: user.FB_PROF_ID, inst: user.INST_ID });

		return;
	}

	if (action === "open-instagram-profile") {
		openInstagramProfile(user.INST_ID);

		return;
	}

	if (action === "open-facebook-profile") {
		openFacebookProfile(user.FB_PROF_ID);

		return;
	}

	if (action === "open-all-stories") {
		openAllUserStories({ fbs: user.FB_STOR_ID, inst: user.INST_ID });

		return;
	}

	if (action === "open-instagram-stories") {
		openInstagramStories(user.INST_ID);

		return;
	}

	if (action === "open-facebook-stories") {
		openFacebookStories(user.FB_STOR_ID);

		return;
	}

	if (action === "open-all-user-pages") {
		openAllUserPages({ fbp: user.FB_PROF_ID, fbs: user.FB_STOR_ID, inst: user.INST_ID });

		return;
	}
});

refGallery.addEventListener("touchstart", (e) => {
	touchstartX = e.changedTouches[0].screenX;
});

refGallery.addEventListener("touchend", (e) => {
	touchendX = e.changedTouches[0].screenX;

	checkDirection();
});

refPhoto.addEventListener("click", () => zoomPhoto());

refPrevPhotoButton.addEventListener("click", () => changePhoto("prev"));
refNextPhotoButton.addEventListener("click", () => changePhoto("next"));

refToggleAllPhotosButton.addEventListener("click", () => toggleAllPhotos());

refZoomPhotoButton.addEventListener("click", () => zoomPhoto());

refCloseGalleryButton.addEventListener("click", () => closeGallery());

refAllPhotos.addEventListener("click", (e) => {
	if (!e.target.attributes.tabindex) return;

	selectPhoto(Number(e.target.attributes.tabindex.value));
});

refConsole.addEventListener("keydown", (e) => {
	if (e.key === "Enter") runCommand(refConsole.value);
});

document.addEventListener("auxclick", (e) => {
	if (e.button === 1) {
		runCommand("/");
	}
});

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowRight" && !isAllPhotosShow) {
		changePhoto("next");

		return;
	}

	if (e.key === "ArrowLeft" && !isAllPhotosShow) {
		changePhoto("prev");

		return;
	}

	if (e.key === "ArrowUp" && gallery === "opened" && !isAllPhotosShow && !isConsoleActive) {
		zoomPhoto();

		return;
	}

	if ((e.key === "ArrowDown" || e.key === "Enter") && gallery === "opened" && !isAllPhotosShow && !isConsoleActive) {
		showAllPhotos();

		return;
	}

	if (e.key === "ArrowRight" && isAllPhotosShow) {
		photoCounter += 1;

		if (photoCounter === favorite[activeUser].PHOTOS.length) photoCounter = 0;

		refCurrentPhoto = document.querySelector(`#photo-${photoCounter}`);
		refCurrentPhoto.focus();

		return;
	}

	if (e.key === "ArrowLeft" && isAllPhotosShow) {
		photoCounter -= 1;

		if (photoCounter < 0) photoCounter = favorite[activeUser].PHOTOS.length - 1;

		refCurrentPhoto = document.querySelector(`#photo-${photoCounter}`);
		refCurrentPhoto.focus();

		return;
	}

	if (e.key === "Enter" && isAllPhotosShow && !isConsoleActive) {
		refPhoto.setAttribute("src", favorite[activeUser].PHOTOS[photoCounter]);

		hideAllPhotos();

		return;
	}

	if (e.key === ">") {
		if (!isConsoleActive) {
			isConsoleActive = true;

			showConsole();

			focusOnConsole = setInterval(() => {
				if (!mobile) refConsole.focus();
			}, 1000);

			return;
		} else {
			isConsoleActive = false;

			hideConsole();

			clearInterval(focusOnConsole);

			if (isAllPhotosShow) {
				refCurrentPhoto.focus();
			} else {
				refGallery.focus();
			}

			return;
		}
	}

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
});
