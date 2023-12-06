import { faverLog, setUserName } from "./faver-log.js";
import { getServerURL } from "./urls.js";
import { closeAccess } from "./close-access.js";

let initialization;

function exportToCheckAccess(initializationFunction) {
	initialization = initializationFunction;
}

async function checkAccess(pass) {
	faverLog(`Checking access...`, "check access");

	await fetch(`${getServerURL()}?pass=${pass}`)
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			if (data.status === 200) {
				setUserName(data.user);

				faverLog(`Access allowed`);

				initialization(data);
			} else {
				faverLog(`Access denied`);

				closeAccess();
			}
		});
}

export { checkAccess, exportToCheckAccess };
