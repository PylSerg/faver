import { refs } from "./state.js";
import { checkAccess } from "./check-access.js";

function autoSendingPassword(pass) {
	if (pass.length >= 4) {
		refs.accessInput.value = "CHECKING ACCESS...";
		refs.accessInput.setAttribute("type", "text");
		refs.accessInput.setAttribute("class", "access-input checking");

		checkAccess(pass);
	}
}

export { autoSendingPassword };
