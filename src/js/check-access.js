import { setFavorite, setState } from "./state.js";
import { faverLog } from "./faver-log.js";
import { SERVER, setDatabaseURL } from "./urls.js";
import { openAccess, closeAccess } from "./access.js";

async function checkAccess(pass) {
	faverLog(`Checking access...`, "check access");

	await fetch(`${SERVER}?pass=${pass}`)
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			if (data.status === 200) {
				faverLog(`Access allowed`);
				faverLog(`Initialization...`);

				setState("userName", data.user);

				setFavorite(data);

				setDatabaseURL(data.database);

				openAccess();
			} else {
				faverLog(`Access denied`);

				closeAccess();
			}
		});
}

export { checkAccess };
