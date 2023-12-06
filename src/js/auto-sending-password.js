import { checkAccess } from "./check-access.js";

let refAccessInput;

function initRefsForAutoSendingPassword(AccessInput) {
	refAccessInput = AccessInput;
}

function autoSendingPassword(pass) {
	if (pass.length >= 4) {
		refAccessInput.value = "CHECKING ACCESS...";
		refAccessInput.setAttribute("type", "text");
		refAccessInput.setAttribute("class", "access-input checking");

		checkAccess(pass);
	}
}

export { autoSendingPassword, initRefsForAutoSendingPassword };
