const SERVER = "https://script.google.com/macros/s/AKfycbywPWqsIIIRrXgy3vo1VtW8OHqOjGNtX1FSUQcpq8tGKXdvy6AaApZbArvcCV8Lw2hkNg/exec";
let DATABASE = "";

const refAccess = document.querySelector(".access");
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

let currentUser = "guest";
let command = "start";
let logger = false;
let isConsoleActive = false;

let touchstartX = 0;
let touchendX = 0;

const shortCommand = [">", ":", '"', "{", "}", "L"];

setInterval(() => {
	shortCommand.map((cmd) => {
		if (refConsole.value === cmd) {
			refConsole.value = "";

			return;
		}
	});
}, 1000);

customLog("Starting Faver...");

function autoSendingPassword(pass) {
	if (pass.length >= 4) {
		refAccessInput.value = "CHECKING ACCESS...";
		refAccessInput.setAttribute("type", "text");
		refAccessInput.setAttribute("class", "access-input checking");

		checkAccess(pass);
	}
}

async function checkAccess(pass) {
	command = "check access";
	customLog(`Checking access...`);

	await fetch(`${SERVER}?pass=${pass}`)
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			if (data.status === 200) {
				currentUser = data.user;
				customLog(`Access allowed`);

				initialization(data);
			} else {
				customLog(`Access denied`);

				closeAccess();
			}
		});
}

function initialization(data) {
	data.data.map((user) => {
		for (const userId in user) {
			favorite[userId] = {};

			for (const key in user[userId]) {
				favorite[userId][key] = user[userId][key];
			}
		}
	});

	DATABASE = data.database;

	openAccess();
}

function openAccess() {
	refAccessInput.remove();

	refAccessText.innerHTML = "ACCESS ALLOWED";
	refAccessText.style.color = "#0a0";
	refAccessText.style.borderColor = "#0a0";

	setTimeout(() => {
		refAccess.remove();

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

function closeAccess() {
	refAccessText.innerHTML = "ACCESS DENIED";
	refAccessText.style.color = "#a00";
	refAccessText.style.borderColor = "#a00";
	refAccessText.setAttribute("class", "access-text access-text--error");

	refAccessInput.setAttribute("type", "password");
	refAccessInput.setAttribute("class", "access-input");
	refAccessInput.value = "";

	setTimeout(() => {
		refAccessText.setAttribute("class", "access-text");
	}, 1100);
}

function createCards() {
	refFavorite.innerHTML = "";

	for (const key in favorite) {
		const data = favorite[key];
		const user = `'${key}'`;

		const fbpId = `'${data.FB_PROF_ID}'`;
		const fbsId = `'${data.FB_STOR_ID}'`;
		const instId = `'${data.INST_ID}'`;
		const avatar = `'${data.AVATAR}'`;
		const description = `"Birthday: ${data.BIRTHDAY}"`;

		const userCard = document.createElement("li");
		userCard.setAttribute("class", "user");
		refFavorite.append(userCard);

		userCard.innerHTML = `
					<div class="user-title">
						<div class="user-avatar" style="background-image: url(${avatar})" onClick="openGallery(${user})"></div>
						
						<span class="user-name" title=${description}>${data.NAME}</span>
					</div>

					<div class="buttons">
						<div class="buttons-profiles-block">
							<button class="button-profiles" type="button" onClick="profiles({fbp: ${fbpId}, inst: ${instId}})">Profiles</button>
								
							<div class="buttons-profiles-individually">
								<button class="button-open-instagram" type="button" onClick="Instagram_Profile(${instId})">Instagram</button>
								<button class="button-open-facebook" type="button" onClick="Facebook_Profile(${fbpId})">Facebook</button>
							</div>
						</div>
					
						<div class="buttons-stories-block">
							<button class="button-stories" type="button" onClick="stories({fbs: ${fbsId}, inst: ${instId}})">Stories</button>

							<div class="buttons-stories-individually">
								<button class="button-open-instagram" type="button" onClick="Instagram_Stories(${instId})">Instagram</button>
								<button class="button-open-facebook" type="button" onClick="Facebook_Stories(${fbsId})">Facebook</button>
							</div>
						</div>

						<button class="button-all" type="button" onClick="openAll({fbp: ${fbpId}, fbs: ${fbsId}, inst: ${instId}})">Open All</button>
					</div>
				`;
	}
}

function createCardsWithoutGUI() {
	refFavorite.innerHTML = "";

	for (const key in favorite) {
		const data = favorite[key];
		const user = `${key}`;

		const userCard = document.createElement("li");
		refFavorite.append(userCard);

		userCard.innerHTML = `
			${user}: ${data.NAME}
		`;
	}
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

function stories(id) {
	Facebook_Stories(id.fbs);
	Instagram_Stories(id.inst);
}

function profiles(id) {
	Facebook_Profile(id.fbp);
	Instagram_Profile(id.inst);
}

function openAll(id) {
	profiles(id);
	stories(id);
}

function Facebook_Stories(id) {
	if (id !== "") window.open(`https://www.facebook.com/stories/${id}?view_single=true`, "_blank");
}

function Facebook_Profile(id) {
	if (id !== "") window.open(`https://www.facebook.com/${id}`, "_blank");
}

function Instagram_Stories(id) {
	if (id !== "") window.open(`https://www.instagram.com/stories/${id}`, "_blank");
}

function Instagram_Profile(id) {
	if (id !== "") window.open(`https://www.instagram.com/${id}`, "_blank");
}

/*
	Gallery
*/
function openGallery(user) {
	if (gallery === "opened" && activeUser === user) {
		customLog(`W: Gallery is already open! \n Use command "sg" to show gallery.`);

		return;
	}

	customLog(`Opening gallery of ${favorite[user].NAME}...`);

	activeUser = user;
	gallery = "opened";
	isAllPhotosShow = false;
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

	customLog(`Gallery is opened`);
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

		customLog(`Zoom is on`);

		return;
	}

	if (zoom) {
		refZoomPhotoButton.setAttribute("class", "zoom-photo-button");
		refPhoto.style.cursor = "zoom-out";

		refPhoto.removeAttribute("style");

		zoom = false;

		customLog(`Zoom is off`);

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

	customLog(`Gallery is closed`);
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
	command = cmd;

	let commandArguments = [];

	commandArguments = cmd.split(" ");

	const user = favorite[`USER_${commandArguments[1]}`];
	const dUser = favorite[`${defaultUser}`];

	const firstArgument = commandArguments[0];
	const secondArgument = commandArguments[1];

	switch (firstArgument) {
		/* Opens Database */
		case "odb":
			customLog(`Opening database...`);

			window.open(DATABASE, "_blank");

			break;

		/* Opens all profiles */
		case "oap":
			if (secondArgument === undefined) {
				customLog(`Opening all profiles of ${dUser.NAME}...`);

				profiles({ fbp: dUser.FB_PROF_ID, inst: dUser.INST_ID });

				break;
			}

			customLog(`Opening all profiles of ${user.NAME}...`);

			profiles({ fbp: user.FB_PROF_ID, inst: user.INST_ID });

			break;

		/* Opens all stories */
		case "oas":
			if (secondArgument === undefined) {
				customLog(`Opening all stories of ${dUser.NAME}...`);

				stories({ fbs: dUser.FB_STOR_ID, inst: dUser.INST_ID });

				break;
			}

			customLog(`Opening all stories of ${user.NAME}...`);

			stories({ fbs: user.FB_STOR_ID, inst: user.INST_ID });

			break;

		/* Opens profile */
		case "ofp":
			if (secondArgument === undefined) {
				customLog(`Opening Facebook profile of ${dUser.NAME}...`);

				Facebook_Profile(dUser.FB_PROF_ID);

				break;
			}

			customLog(`Opening Facebook profile of ${user.NAME}...`);

			Facebook_Profile(user.FB_PROF_ID);

			break;

		case "oip":
			if (secondArgument === undefined) {
				customLog(`Opening Instagram profile of ${dUser.NAME}...`);

				Instagram_Profile(dUser.INST_ID);

				break;
			}

			customLog(`Opening Instagram profile of ${user.NAME}...`);

			Instagram_Profile(user.INST_ID);

			break;

		/* Opens stories */
		case "ofs":
			if (secondArgument === undefined) {
				customLog(`Opening Facebook stories of ${dUser.NAME}...`);

				Facebook_Stories(dUser.FB_STOR_ID);

				break;
			}

			customLog(`Opening Facebook stories of ${user.NAME}...`);

			Facebook_Stories(user.FB_STOR_ID);

			break;

		case "ois":
			if (secondArgument === undefined) {
				customLog(`Opening Instagram stories of ${dUser.NAME}...`);

				Instagram_Stories(dUser.INST_ID);

				break;
			}

			customLog(`Opening Instagram stories of ${user.NAME}...`);

			Instagram_Stories(user.INST_ID);

			break;

		/* Opens all */
		case "oa":
			if (secondArgument === undefined) {
				customLog(`Opening all pages of ${dUser.NAME}...`);

				openAll({ fbp: dUser.FB_PROF_ID, fbs: dUser.FB_STOR_ID, inst: dUser.INST_ID });

				break;
			}

			customLog(`Opening all pages of ${user.NAME}...`);

			openAll({ fbp: user.FB_PROF_ID, fbs: user.FB_STOR_ID, inst: user.INST_ID });

			break;

		/* Opens gallery */
		case "og":
			if (secondArgument === undefined) {
				openGallery(defaultUser);

				break;
			}

			openGallery(`USER_${secondArgument}`);

			break;

		/* Closes gallery */
		case "cg":
			customLog(`Closing gallery...`);

			closeGallery();

			break;

		/* Shows\hides gallery */
		case "sg":
			if (gallery === "closed") {
				customLog(`E: Gallery is closed!`);

				break;
			}

			refGallery.style.visibility = "visible";

			customLog(`Gallery is show`);

			hideLog();

			break;

		case "hg":
			if (gallery === "closed") {
				customLog(`E: Gallery is closed!`);

				break;
			}

			refGallery.style.visibility = "hidden";

			customLog(`Gallery is hide`);

			showLog();

			break;

		/* Shows birthday */
		case "bd":
			if (secondArgument === undefined) {
				customLog(`Birthday of ${dUser.NAME}: ${dUser.BIRTHDAY}`);

				break;
			}

			customLog(`Birthday of ${user.NAME}: ${user.BIRTHDAY}`);

			break;

		/* Photo quantity */
		case "phq":
			if (secondArgument === undefined) {
				customLog(`${dUser.PHOTOS.length} photos of ${dUser.NAME}`);

				break;
			}

			customLog(`${user.PHOTOS.length} photos of ${user.NAME}`);

			break;

		/* Service commands */

		// Off\On GUI
		case "gui":
			if (secondArgument === "on") {
				GUI = "on";

				changeGuiButton();
				createCards();
				hideLog();
				hideConsole();

				localStorage.setItem("GUI", "on");

				customLog(`GUI is on`);
			}

			if (secondArgument === "off") {
				GUI = "off";

				changeGuiButton();
				createCardsWithoutGUI();
				showConsole();
				showLog();

				localStorage.setItem("GUI", "off");

				customLog(`GUI is off`);
			}

			break;

		// Hides\shows log
		case "l":
			if (!logger) {
				showLog();
			} else {
				hideLog();
			}

			break;

		// Clears log list
		case "c":
			refConsoleLog.innerHTML = "";

			break;

		// Exit
		case "/":
			location.reload();

			break;

		default:
			customLog(`E: Command "${command}" not found`);
	}

	refConsole.value = "";
}

function customLog(info) {
	let logColor = "";

	if (info.includes("E:") || info.includes("denied")) logColor = "style='color: #822'";

	if (info.includes("W:")) logColor = "style='color: #882'";

	if (info.includes("allowed")) logColor = "style='color: #282'";

	let logInfo = `
		<span ${logColor}>${info}</span>
	`;

	const newLog = document.createElement("li");

	newLog.innerHTML = `
		<b style="color: #358">${currentUser}@faver</b>:~$ <b style="color: #883">${command}</b>
		<br/>
		${logInfo}
		<br/><br/>
	`;

	refConsoleLog.append(newLog);

	refConsoleLog.scrollTop = refConsoleLog.scrollHeight;

	console.log(`\x1b[01;36m${currentUser}@faver\x1b[0m:~$ \x1b[33m${command}\x1b[0m\n\n${info}\n\n`);

	command = "";
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

refCloseGalleryButton.addEventListener("click", () => runCommand("cg"));

refCurrentPhoto.addEventListener("click", () => selectPhoto(photoCounter));

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
