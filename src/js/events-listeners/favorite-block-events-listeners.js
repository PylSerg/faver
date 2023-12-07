import { refs, favorite } from "../state.js";
import { openAllUserProfiles, openAllUserStories, openAllUserPages, openFacebookStories, openFacebookProfile, openInstagramStories, openInstagramProfile } from "../open-user-pages.js";
import { openGallery } from "../gallery.js";

export default function favoriteBlockEventsListeners() {
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
}
