import accessEventsListeners from "./events-listeners/access-events-listeners.js";
import toggleGuiEventsListeners from "./events-listeners/toggle-gui-events-listeners.js";
import favoriteBlockEventsListeners from "./events-listeners/favorite-block-events-listeners.js";
import galleryEventsListeners from "./events-listeners/gallery-events-listeners.js";
import consoleEventsListeners from "./events-listeners/console-events-listeners.js";
import keyShortcutsEventsListeners from "./events-listeners/key-shortcuts-events-listeners.js";

export default function eventsListeners() {
	accessEventsListeners();
	toggleGuiEventsListeners();
	favoriteBlockEventsListeners();
	galleryEventsListeners();
	consoleEventsListeners();
	keyShortcutsEventsListeners();
}
