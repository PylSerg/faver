export default function createCards(favorite, refFavorite) {
	refFavorite.innerHTML = "";

	for (const key in favorite) {
		const data = favorite[key];
		const user = `'${key}'`;

		const avatar = `'${data.AVATAR}'`;
		const description = `"Birthday: ${data.BIRTHDAY}"`;

		const userCard = document.createElement("li");

		userCard.setAttribute("class", "user");

		refFavorite.append(userCard);

		userCard.innerHTML = `
					<div class="user-title">
						<div class="user-avatar" style="background-image: url(${avatar})" action="open-gallery" key=${user} ></div>
						
						<span class="user-name" title=${description}>${data.NAME}</span>
					</div>

					<div class="buttons">
						<div class="buttons-profiles-block">
							<button class="button-profiles" type="button" action="open-all-profiles" key=${user}>Profiles</button>
								
							<div class="buttons-profiles-individually">
								<button class="button-open-instagram" type="button" action="open-instagram-profile" key=${user}>Instagram</button>
								<button class="button-open-facebook" type="button" action="open-facebook-profile" key=${user}>Facebook</button>
							</div>
						</div>
					
						<div class="buttons-stories-block">
							<button class="button-stories" type="button" action="open-all-stories" key=${user}>Stories</button>

							<div class="buttons-stories-individually">
								<button class="button-open-instagram" type="button" action="open-instagram-stories" key=${user}>Instagram</button>
								<button class="button-open-facebook" type="button" action="open-facebook-stories" key=${user}>Facebook</button>
							</div>
						</div>

						<button class="button-all" type="button" action="open-all-user-pages" key=${user}>Open All</button>
					</div>
				`;
	}
}
