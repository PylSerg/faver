const SERVER = "https://script.google.com/macros/s/AKfycbzaRdbc06QSFZlU5Vfp7sxwh70CgRJtv5tyLqfMRwV29aZimZ1S46jirhsUafVsmJJZpQ/exec";

const refAccess = document.querySelector(".access");
const refAccessText = document.querySelector(".access-text");
const refAccessInput = document.querySelector(".access-input");

const refFavorite = document.querySelector("#favorite");

const refGallery = document.querySelector(".gallery-block");
const refPhoto = document.querySelector("#photo");
const refPrev = document.querySelector("#prev");
const refNext = document.querySelector("#next");
const refGalleryBottomLine = document.querySelector("#gallery-bottom-line");

const refAllPhotos = document.querySelector("#all-photos");
const refToggleAllPhotos = document.querySelector(".toggle-all-photos");

const refOpenDatabase = document.querySelector("#open-database");

const favorite = {};

let activeUser = "";
let showAllPhoto = null;
let photoCounter = 0;

function checkAccess(pass) {
	if (pass.length === 4) {
		refAccessInput.setAttribute("class", "access-input checking");

		getUsers(pass);
	}
}

async function getUsers(pass) {
	await fetch(`${SERVER}?pass=${pass}`)
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			if (data.status === 200) {
				data.data.map((user) => {
					for (const userId in user) {
						favorite[userId] = {};

						for (const key in user[userId]) {
							favorite[userId][key] = user[userId][key];
						}
					}
				});

				refOpenDatabase.setAttribute("href", data.database);

				openAccess();

				console.log(`\x1b[32m Access allowed`);
			} else {
				refAccessInput.setAttribute("class", "access-input");

				console.log(`\x1b[31m Access denied`);
			}
		});
}

function openAccess() {
	setTimeout(() => {
		refAccess.style.display = "none";
		refOpenDatabase.style.display = "block";
	}, 1000);

	refAccessInput.style.display = "none";
	refAccessText.innerHTML = "ACCESS ALLOWED";
	refAccessText.style.color = "#0a0";

	createCards();
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
						<div class="user-avatar" style="background-image: url(${avatar}); background-size: cover; background-position: center;" onClick="openGallery(${user})"></div>
						
						<span class="user-name" title=${description}>${data.NAME}</span>
					</div>

					<div class="buttons">
						<div class="buttons-stories-block">
							<button class="button-stories" type="button" onClick="stories({fbs: ${fbsId}, inst: ${instId}})">Stories</button>

							<div class="buttons-stories-individually">
								<button class="button-open-instagram" type="button" onClick="Instagram_Stories(${instId})">Instagram</button>
								<button class="button-open-facebook" type="button" onClick="Facebook_Stories(${fbsId})">Facebook</button>
							</div>
						</div>

						<div class="buttons-profiles-block">
							<button class="button-profiles" type="button" onClick="profiles({fbp: ${fbpId}, inst: ${instId}})">Profile</button>
							
							<div class="buttons-profiles-individually">
								<button class="button-open-instagram" type="button" onClick="Instagram_Profile(${instId})">Instagram</button>
								<button class="button-open-facebook" type="button" onClick="Facebook_Profile(${fbpId})">Facebook</button>
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

	refGallery.style.display = "flex";
	refAllPhotos.style.display = "flex";
	refToggleAllPhotos.setAttribute("src", "photo.png");

	viewAllPhotos();

	for (const key in favorite) {
		const data = favorite[key];

		if (key === activeUser) {
			refPhoto.setAttribute("src", data.PHOTOS[photoCounter]);
		}
	}
}

function closeGallery() {
	refGallery.style.display = "none";

	refAllPhotos.style.display = "none";

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
