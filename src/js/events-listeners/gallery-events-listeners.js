import { state, refs, favorite, setState, setRef } from "../state.js";
import { changePhoto, selectPhoto, showAllPhotos, hideAllPhotos, toggleAllPhotos, zoomPhoto, closeGallery } from "../gallery.js";
import { checkDirection } from "../check-direction.js";

export default function galleryEventsListeners() {
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

	refs.gallery.addEventListener("touchstart", (e) => {
		state.touchstartX = e.changedTouches[0].screenX;
	});

	refs.gallery.addEventListener("touchend", (e) => {
		state.touchendX = e.changedTouches[0].screenX;

		checkDirection();
	});

	document.addEventListener("keydown", (e) => {
		if (state.isConsoleActive || !state.isGalleryOpen) return;

		if (e.key === "ArrowRight" && !state.isAllPhotosShow) {
			changePhoto("next");

			return;
		}

		if (e.key === "ArrowLeft" && !state.isAllPhotosShow) {
			changePhoto("prev");

			return;
		}

		if (e.key === "ArrowUp" && !state.isAllPhotosShow) {
			zoomPhoto();

			return;
		}

		if ((e.key === "ArrowDown" || e.key === "Enter") && !state.isAllPhotosShow) {
			showAllPhotos();

			return;
		}

		if (e.key === "ArrowRight" && state.isAllPhotosShow) {
			setState("photoCounter", (state.photoCounter += 1));

			if (state.photoCounter === favorite[state.activeUser].PHOTOS.length) setState("photoCounter", (state.photoCounter = 0));

			setRef("currentPhoto", document.querySelector(`#photo-${state.photoCounter}`));

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

		if (e.key === "Enter" && state.isAllPhotosShow) {
			refs.photo.setAttribute("src", favorite[state.activeUser].PHOTOS[state.photoCounter]);

			hideAllPhotos();

			return;
		}
	});
}
