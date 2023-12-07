import { state, refs, favorite, setState, setRef } from "./src/js/state.js";
import { autoSendingPassword } from "./src/js/auto-sending-password.js";
import { toggleGUI } from "./src/js/toggle-gui.js";
import { openAllUserProfiles, openAllUserStories, openAllUserPages, openFacebookStories, openFacebookProfile, openInstagramStories, openInstagramProfile } from "./src/js/open-user-pages.js";
import { openGallery, changePhoto, selectPhoto, showAllPhotos, hideAllPhotos, toggleAllPhotos, zoomPhoto, closeGallery } from "./src/js/gallery.js";
import { checkDirection } from "./src/js/check-direction.js";

import { showConsole, hideConsole } from "./src/js/console-controller.js";
import { runCommand } from "./src/js/run-command.js";
import { faverLog } from "./src/js/faver-log.js";

import keyShortcutsEventListener from "./src/js/key-shortcuts-listener.js";

faverLog("Starting Faver...", "start");

keyShortcutsEventListener();

/*
	Events listeners
*/

refs.accessInput.addEventListener("input", (e) => autoSendingPassword(e.currentTarget.value));

refs.guiSwitcher.addEventListener("click", () => toggleGUI());

refs.favorite.addEventListener("click", (e) => {
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

refs.gallery.addEventListener("touchstart", (e) => {
	touchstartX = e.changedTouches[0].screenX;
});

refs.gallery.addEventListener("touchend", (e) => {
	touchendX = e.changedTouches[0].screenX;

	checkDirection();
});

refs.photo.addEventListener("click", () => zoomPhoto());

refs.prevPhotoButton.addEventListener("click", () => changePhoto("prev"));
refs.nextPhotoButton.addEventListener("click", () => changePhoto("next"));

refs.toggleAllPhotosButton.addEventListener("click", () => toggleAllPhotos());

refs.zoomPhotoButton.addEventListener("click", () => zoomPhoto());

refs.closeGalleryButton.addEventListener("click", () => closeGallery());

refs.allPhotos.addEventListener("click", (e) => {
	if (!e.target.attributes.tabindex) return;

	selectPhoto(Number(e.target.attributes.tabindex.value));
});

refs.console.addEventListener("keydown", (e) => {
	if (e.key === "Enter") runCommand(refs.console.value);
});

document.addEventListener("auxclick", (e) => {
	if (e.button === 1) {
		runCommand("/");
	}
});

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowRight" && !state.isAllPhotosShow) {
		changePhoto("next");

		return;
	}

	if (e.key === "ArrowLeft" && !state.isAllPhotosShow) {
		changePhoto("prev");

		return;
	}

	if (e.key === "ArrowUp" && state.isGalleryOpen && !state.isAllPhotosShow && !state.isConsoleActive) {
		zoomPhoto();

		return;
	}

	if ((e.key === "ArrowDown" || e.key === "Enter") && state.isGalleryOpen && !state.isAllPhotosShow && !state.isConsoleActive) {
		showAllPhotos();

		return;
	}

	if (e.key === "ArrowRight" && state.isAllPhotosShow) {
		setState("photoCounter", (state.photoCounter += 1));

		if (state.photoCounter === favorite[state.activeUser].PHOTOS.length) setState("photoCounter", (state.photoCounter = 0));

		setRef("currentPhoto", document.querySelector(`#photo-${photoCounter}`));

		refs.currentPhoto.focus();

		return;
	}

	if (e.key === "ArrowLeft" && state.isAllPhotosShow) {
		setState("photoCounter", (state.photoCounter -= 1));

		if (state.photoCounter < 0) setState("photoCounter", favorite[state.activeUser].PHOTOS.length - 1);

		setRef("currentPhoto", document.querySelector(`#photo-${state.photoCounter}`));

		refs.currentPhoto.focus();

		return;
	}

	if (e.key === "Enter" && state.isAllPhotosShow && !state.isConsoleActive) {
		refs.photo.setAttribute("src", favorite[state.activeUser].PHOTOS[state.photoCounter]);

		hideAllPhotos();

		return;
	}

	if (e.key === ">") {
		if (!state.isConsoleActive) {
			setState("isConsoleActive", true);

			showConsole();

			setState(
				"focusOnConsole",
				setInterval(() => {
					if (!state.isItMobile) refs.console.focus();
				}, 1000),
			);

			return;
		} else {
			setState("isConsoleActive", false);

			hideConsole();

			clearInterval(state.focusOnConsole);

			if (state.isAllPhotosShow) {
				refs.currentPhoto.focus();
			} else {
				refs.gallery.focus();
			}

			return;
		}
	}
});
