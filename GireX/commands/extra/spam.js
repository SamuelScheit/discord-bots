global.messages = [];

module.exports.init = () => {
	setInterval(() => {
		messages = [];
	}, 15000);
};

module.exports.check = message => {
	var sender;
	client.guilds.forEach(y => {
		var t = y.member(message.author.id);
		if (t != undefined) {
			sender = t;
		}
	});

	if (sender != undefined) {
		try {
			var r = sender.colorRole.id;
		} catch (e) {}

		try {
			if (
				r != "552521435852046338" &&
				r != "563387182409056334" &&
				r != "553608928844316672" &&
				r != "552523401181265920" &&
				r != "553661828132241459" &&
				r != "554279659022581760"
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
		} catch (e) {
			console.error(e);
		}
	}
	return false;
};
