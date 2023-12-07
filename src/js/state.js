const state = {
	isItMobile: window.navigator.userAgentData.mobile,

	GUI: localStorage.getItem("GUI") ?? "on",

	userName: "guest",
	activeUser: "USER_1",
	defaultUser: "USER_1",

	isLoggerActive: false,
	isConsoleActive: false,

	isGalleryOpen: false,
	isAllPhotosShow: false,
	isZoomActive: false,
	photoCounter: 0,

	touchstartX: 0,
	touchendX: 0,

	focusOnConsole: "setInterval",
};

const refs = {
	accessBlock: document.querySelector(".access-block"),
	accessText: document.querySelector(".access-text"),
	accessInput: document.querySelector("[data-input-password]"),

	guiSwitcher: document.querySelector("[data-gui-switcher]"),

	favorite: document.querySelector("#favorite"),

	gallery: document.querySelector(".gallery-block"),
	allPhotos: document.querySelector("[data-all-photos]"),
	currentPhoto: document.querySelector("[data-empty]"),
	photo: document.querySelector("[data-photo]"),
	prevPhotoButton: document.querySelector("[data-prev-photo]"),
	nextPhotoButton: document.querySelector("[data-next-photo]"),
	toggleAllPhotosButton: document.querySelector("[data-toggle-all-photos-button]"),
	zoomPhotoButton: document.querySelector("[data-zoom-photo-button]"),
	closeGalleryButton: document.querySelector("[data-close-gallery-button]"),

	consoleBlock: document.querySelector(".console-block"),
	consoleLog: document.querySelector("[data-console-log]"),
	console: document.querySelector("[data-console]"),
};

const favorite = {};

function setState(key, value) {
	state[`${key}`] = value;
}

function setRef(key, value) {
	refs[`${key}`] = value;
}

function setFavorite(data) {
	data.data.map((user) => {
		for (const userId in user) {
			favorite[userId] = {};

			for (const key in user[userId]) {
				favorite[userId][key] = user[userId][key];
			}
		}
	});
}

export { state, refs, favorite, setState, setRef, setFavorite };
