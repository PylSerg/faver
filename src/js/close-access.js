let refAccessText;
let refAccessInput;

function initRefsForCloseAccess(AccessText, AccessInput) {
	refAccessText = AccessText;
	refAccessInput = AccessInput;
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

export { closeAccess, initRefsForCloseAccess };
