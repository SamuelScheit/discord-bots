global.messages = [];

module.exports.init = () => {
	setInterval(() => {
		messages = [];
	}, 15000);
};

module.exports.check = message => {
	var sender = message.member;

	if (sender != undefined) {
		role = sender.roles.find(
			x =>
				x.id == "530180933647597578" ||
				x.id == "534744418184593418" ||
				x.id == "530405882480295970" ||
				x.id == "541553568617070593" ||
				x.id == "530404628316160000" ||
				x.id == "539419982090469407" ||
				x.id == "534722702729150475" ||
				x.id == "549365064600387606" ||
				x.id == "549364072261484544" ||
				x.id == "530351414636052480" ||
				x.id == "562347970209775646" ||
				x.id == "533452559956836372" ||
				x.id == "562349053300703232" ||
				x.id == "562359113682649100" ||
				x.id == "562358462219157534" ||
				x.id == "530343702262972416"
		);

		if (
			roles == undefined &&
			message.channel.id != "563090475448533024" &&
			message.channel.id != "562355578257539116" &&
			message.channel.id != "563088656965959695" &&
			message.channel.id != "562618736536977443" &&
			message.channel.id != "563090546038407257" &&
			message.channel.id != "563090581304246309" &&
			message.channel.id != "563446688857980929" &&
			message.channel.id != "541370359354491041" &&
			message.channel.id != "567021931505778696" &&
			sender.highestRole.hasPermission(8192) == false
		) {
			var m = message.content.split(" ");
			var CapsGesamt = 0;
			var spam = false;

			messages.push(message.author.id);

			//CAPS
			m.forEach(e => {
				for (var j = 0; j < e.length; j++) {
					var c = e.charAt(j);
					if (c != c.toLowerCase()) {
						CapsGesamt++;
					}
				}
			});
			if (CapsGesamt / m.length > 2) {
				sender.user
					.send({
						embed: {
							color: 0xff0000,
							title: "Spam: Caps",
							thumbnail: {
								url: client.user.avatarURL
							},
							description: "Bitte Spamme kein Caps"
						}
					})
					.catch(e => {});
				spam = true;
			}

			//LINK
			if (
				new RegExp(
					"([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
				).test(message.content)
			) {
				sender.user
					.send({
						embed: {
							color: 0xff0000,
							title: "Spam: Link",
							thumbnail: {
								url: client.user.avatarURL
							},
							description: "Bitte schicke keine Links"
						}
					})
					.catch(e => {});
				spam = true;
			}

			//SPAM
			if (messages.filter(x => x == message.author.id).length > 5) {
				sender.user
					.send({
						embed: {
							color: 0xff0000,
							title: "Spam",
							thumbnail: {
								url: client.user.avatarURL
							},
							description: "Du sendest zu viele Nachrichten!"
						}
					})
					.catch(e => {});
				spam = true;
			}

			if (spam == true) {
				console.log("Spam: " + sender.user.tag);
				message.delete().catch(e => console.error(e));
				return true;
			}
		}
	}
	return false;
};
