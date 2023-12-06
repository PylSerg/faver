function openAllUserProfiles(id) {
	openFacebookProfile(id.fbp);
	openInstagramProfile(id.inst);
}

function openAllUserStories(id) {
	openFacebookStories(id.fbs);
	openInstagramStories(id.inst);
}

function openAllUserPages(id) {
	openAllUserProfiles(id);
	openAllUserStories(id);
}

function openFacebookStories(id) {
	if (id !== "") window.open(`https://www.facebook.com/stories/${id}?view_single=true`, "_blank");
}

function openFacebookProfile(id) {
	if (id !== "") window.open(`https://www.facebook.com/${id}`, "_blank");
}

function openInstagramStories(id) {
	if (id !== "") window.open(`https://www.instagram.com/stories/${id}`, "_blank");
}

function openInstagramProfile(id) {
	if (id !== "") window.open(`https://www.instagram.com/${id}`, "_blank");
}

export { openAllUserProfiles, openAllUserStories, openAllUserPages, openFacebookStories, openFacebookProfile, openInstagramStories, openInstagramProfile };
