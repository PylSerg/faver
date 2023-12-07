import { state } from "./state.js";
import { changePhoto } from "./gallery.js";

function checkDirection() {
	if (state.isZoomActive) return;

	if (state.touchendX < state.touchstartX) changePhoto("next");
	if (state.touchendX > state.touchstartX) changePhoto("prev");
}

export { checkDirection };
