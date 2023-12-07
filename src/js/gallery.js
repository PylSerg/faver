import { state, refs, favorite, setState, setRef } from "./state.js";
import { showLog, hideLog } from "./console-controller.js";
import { faverLog } from "./faver-log.js";

function openGallery(user) {
	if (state.isGalleryOpen && state.activeUser === user) {
		faverLog(`W: Gallery is already open! \nUse command "sg" to show gallery.`);

		return;
	}

	setState("activeUser", user);
	setState("isGalleryOpen", true);
	setState("photoCounter", 0);
	setState("isConsoleActive", false);

	clearInterval(state.focusOnConsole);

	hideLog();
	viewAllPhotos();

	refs.gallery.style.visibility = "visible";
	refs.console.style.backgroundColor = "transparent";
	refs.gallery.style.display = "flex";

	showAllPhotos();

	for (const key in favorite) {
		const data = favorite[key];

		if (key === state.activeUser) {
			refs.photo.setAttribute("src", data.PHOTOS[state.photoCounter]);

			break;
		}
	}

	faverLog(`Gallery is opened`);
}

function changePhoto(action) {
	if (state.isZoomActive) zoomPhoto();

	for (const key in favorite) {
		const user = favorite[key];

		if (key === state.activeUser) {
			if (action === "prev") {
				if (state.photoCounter === 0) {
					setState("photoCounter", user.PHOTOS.length - 1);
				} else {
					setState("photoCounter", (state.photoCounter -= 1));
				}
			}

			if (action === "next") {
				if (state.photoCounter === user.PHOTOS.length - 1) {
					setState("photoCounter", 0);
				} else {
					setState("photoCounter", (state.photoCounter += 1));
				}
			}

			refs.photo.setAttribute("src", user.PHOTOS[state.photoCounter]);
		}
	}
}

function viewAllPhotos() {
	refs.allPhotos.innerHTML = "";

	favorite[state.activeUser].PHOTOS.map((photoURL) => {
		const photoPreviewBox = document.createElement("div");
		const photo = document.createElement("img");

		photo.setAttribute("id", `photo-${favorite[state.activeUser].PHOTOS.indexOf(photoURL)}`);
		photo.setAttribute("tabindex", favorite[state.activeUser].PHOTOS.indexOf(photoURL));

		photoPreviewBox.setAttribute("class", "photo-review-box");

		photo.setAttribute("class", "photo-preview");
		photo.setAttribute("src", photoURL);

		refs.allPhotos.append(photoPreviewBox);
		photoPreviewBox.append(photo);
	});
}

function selectPhoto(indx) {
	setState("photoCounter", indx);

	refs.photo.setAttribute("src", favorite[state.activeUser].PHOTOS[state.photoCounter]);

	hideAllPhotos();
}

function showAllPhotos() {
	setState("isAllPhotosShow", true);

	refs.zoomPhotoButton.style.display = "none";
	refs.allPhotos.style.display = "flex";
	refs.toggleAllPhotosButton.setAttribute("src", "src/images/photo.png");
	refs.photo.style.zIndex = "1";

	setRef("currentPhoto", document.querySelector(`#photo-${state.photoCounter}`));

	refs.currentPhoto.focus();

	if (state.isZoomActive) zoomPhoto();
}

function hideAllPhotos() {
	setState("isAllPhotosShow", false);

	refs.zoomPhotoButton.style.display = "block";
	refs.allPhotos.style.display = "none";
	refs.toggleAllPhotosButton.setAttribute("src", "src/images/gallery.png");
}

function toggleAllPhotos() {
	if (!state.isAllPhotosShow) {
		showAllPhotos();
		return;
	}

	if (state.isAllPhotosShow) {
		hideAllPhotos();
		return;
	}
}

function zoomPhoto() {
	if (!state.isZoomActive) {
		refs.zoomPhotoButton.setAttribute("class", "zoom-photo-button zoom-photo-button--active");

		refs.photo.style.maxHeight = "10000px";
		refs.photo.style.position = "absolute";
		refs.photo.style.top = "0";
		refs.photo.style.zIndex = "100";
		refs.photo.style.cursor = "zoom-out";

		setState("isZoomActive", true);

		faverLog(`Zoom is on`);

		return;
	}

	if (state.isZoomActive) {
		refs.zoomPhotoButton.setAttribute("class", "zoom-photo-button");
		refs.photo.style.cursor = "zoom-out";

		refs.photo.removeAttribute("style");

		setState("isZoomActive", false);

		faverLog(`Zoom is off`);

		return;
	}
}

function closeGallery() {
	refs.gallery.style.display = "none";
	refs.allPhotos.style.display = "none";
	refs.console.style.backgroundColor = "#000";

	if (state.GUI === "off") showLog();

	setState("isGalleryOpen", false);
	setState("isAllPhotosShow", false);
	setState("activeUser", "");

	if (state.isZoomActive) zoomPhoto();

	setState("isConsoleActive", true);
	setState(
		"focusOnConsole",
		setInterval(() => {
			if (!state.isItMobile) refs.console.focus();
		}, 1000),
	);

	faverLog(`Gallery is closed`);
}

export { openGallery, changePhoto, viewAllPhotos, selectPhoto, showAllPhotos, hideAllPhotos, toggleAllPhotos, zoomPhoto, closeGallery };
