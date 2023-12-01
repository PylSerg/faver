const SERVER = "https://script.google.com/macros/s/AKfycbywPWqsIIIRrXgy3vo1VtW8OHqOjGNtX1FSUQcpq8tGKXdvy6AaApZbArvcCV8Lw2hkNg/exec";
let DATABASE = "";

const refAccess = document.querySelector(".access");
const refAccessText = document.querySelector(".access-text");
const refAccessInput = document.querySelector(".access-input");

const refFavorite = document.querySelector("#favorite");

const refGallery = document.querySelector(".gallery-block");
const refPhoto = document.querySelector("#photo");
const refPrev = document.querySelector("#prev");
const refNext = document.querySelector("#next");

const refAllPhotos = document.querySelector("#all-photos");
const refToggleAllPhotos = document.querySelector(".toggle-all-photos");

const refConsoleBlock = document.querySelector(".console-block");
const refConsole = document.querySelector("#console");

const favorite = {};

let activeUser = "";
let showAllPhoto = null;
let photoCounter = 0;

let currentUser = "guest";
let command = "start";

customConsole("Starting Faver...");

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
	customConsole(`Checking access...`);

	await fetch(`${SERVER}?pass=${pass}`)
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			if (data.status === 200) {
				currentUser = data.user;
				customConsole(`\x1b[01;32mAccess allowed`);

				initialization(data);
			} else {
				customConsole(`\x1b[01;31mAccess denied`);

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
	setTimeout(() => {
		refAccess.remove();

		refConsoleBlock.style.display = "block";

		setInterval(() => {
			refConsole.focus();
		}, 1000);
	}, 1000);

	refAccessInput.remove();

	refAccessText.innerHTML = "ACCESS ALLOWED";
	refAccessText.style.color = "#0a0";
	refAccessText.style.borderColor = "#0a0";

	createCards();
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

function openGallery(user) {
	activeUser = user;
	photoCounter = 0;
	showAllPhoto = true;

	viewAllPhotos();

	refConsole.style.backgroundColor = "transparent";
	refGallery.style.display = "flex";
	refAllPhotos.style.display = "flex";
	refToggleAllPhotos.setAttribute("src", "photo.png");

	for (const key in favorite) {
		const data = favorite[key];

		if (key === activeUser) {
			refPhoto.setAttribute("src", data.PHOTOS[photoCounter]);

			break;
		}
	}
}

function closeGallery() {
	refGallery.style.display = "none";
	refAllPhotos.style.display = "none";
	refConsole.style.backgroundColor = "#000";

	activeUser = "";
}

function changePhoto(action) {
	for (const key in favorite) {
		const data = favorite[key];

		if (key === activeUser) {
			if (action === "prev") {
				if (photoCounter === 0) {
					photoCounter = data.PHOTOS.length - 1;
				} else {
					photoCounter -= 1;
				}
			}

			if (action === "next") {
				if (photoCounter === data.PHOTOS.length - 1) {
					photoCounter = 0;
				} else {
					photoCounter += 1;
				}
			}

			refPhoto.setAttribute("src", data.PHOTOS[photoCounter]);
		}
	}
}

function toggleAllPhotos() {
	if (!showAllPhoto) {
		showAllPhoto = true;

		refAllPhotos.style.display = "flex";
		refToggleAllPhotos.setAttribute("src", "photo.png");

		viewAllPhotos();

		return;
	}

	if (showAllPhoto) {
		showAllPhoto = false;

		refAllPhotos.style.display = "none";
		refToggleAllPhotos.setAttribute("src", "gallery.png");

		return;
	}
}

function viewAllPhotos() {
	refAllPhotos.innerHTML = "";

	favorite[activeUser].PHOTOS.map((photoURL) => {
		const photoPreviewBox = document.createElement("div");
		const photo = document.createElement("img");

		photoPreviewBox.setAttribute("class", "photo-review-box");

		photo.setAttribute("class", "photo-preview");
		photo.setAttribute("src", photoURL);
		photo.setAttribute("onClick", `selectPhoto(${favorite[activeUser].PHOTOS.indexOf(photoURL)})`);

		refAllPhotos.append(photoPreviewBox);
		photoPreviewBox.append(photo);
	});
}

function selectPhoto(indx) {
	photoCounter = indx;

	refPhoto.setAttribute("src", favorite[activeUser].PHOTOS[photoCounter]);

	toggleAllPhotos();
}

function getConsoleCommand(cmd) {
	command = cmd;
}

function sendConsoleCommand(e) {
	if (e.key === "Enter") consoleCommands();
}

function consoleCommands() {
	let commandArguments = [];

	commandArguments = command.split(" ");

	const user = favorite[`USER_${commandArguments[1]}`];

	switch (commandArguments[0]) {
		case "odb":
			customConsole(`Opening database...`);

			window.open(DATABASE, "_blank");

			break;

		case "oap":
			customConsole(`Opening all profiles of ${user.NAME}...`);

			profiles({ fbp: user.FB_PROF_ID, inst: user.INST_ID });

			break;

		case "ofp":
			customConsole(`Opening Facebook profile of ${user.NAME}...`);

			Facebook_Profile(user.FB_PROF_ID);

			break;

		case "oip":
			customConsole(`Opening Instagram profile of ${user.NAME}...`);

			Instagram_Profile(user.INST_ID);

			break;

		case "oas":
			customConsole(`Opening all stories of ${user.NAME}...`);

			stories({ fbs: user.FB_STOR_ID, inst: user.INST_ID });

			break;

		case "ofs":
			customConsole(`Opening Facebook stories of ${user.NAME}...`);

			Facebook_Stories(user.FB_STOR_ID);

			break;

		case "ois":
			customConsole(`Opening Instagram stories of ${user.NAME}...`);

			Instagram_Stories(user.INST_ID);

			break;

		case "oa":
			customConsole(`Opening all pages of ${user.NAME}...`);

			openAll({ fbp: user.FB_PROF_ID, fbs: user.FB_STOR_ID, inst: user.INST_ID });

			break;

		default:
			customConsole(`\x1b[31mError: Command not found`);
	}

	refConsole.value = "";
}

function customConsole(info) {
	console.log(`\x1b[01;36m${currentUser}@faver\x1b[0m:~$ \x1b[33m${command}\x1b[0m\n\n${info}\n\n`);
}

refConsole.addEventListener("keydown", sendConsoleCommand);
