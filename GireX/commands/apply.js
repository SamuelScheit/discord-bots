function frage(f, a) {
	this.frage = f;
	this.antwort = a;
}

var fragen = function() {
	this.array = [
		new frage("Wie heißt du?"),
		new frage("Wie alt bist du?"),
		new frage("Wie lange bist du täglich online?"),
		new frage("Fortnite Tracker Link oder Epic Namen"),
		new frage(
			"Wärst du bereit auf Discord deinen Namen zu ändern und das Logo rein zu machen?"
		),
		new frage("Würdest du deinen Epic Namen ändern?"),
		new frage("Warum willst du in den Clan?"),
		new frage("Welche Erfahrungen hast du?")
	];
};

module.exports.run = function(message, args) {
	if (config.bewerbungen.find(x => x.user == message.author.id)) {
		message.channel
			.send(
				"Du hast bereits eine Bewerbung offen! schließe sie mit ``%cancel``"
			)
			.catch(e => {
				message.channel.send({
					embed: {
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						color: 0xff0000,
						title: "Fehler",
						description: e.message
					}
				});
			});
	} else {
		var t = config.bewerbungen.push({
			fragen: new fragen(),
			user: message.author.id,
			frage: 0
		});

		console.log(message, args);
		message.channel
			.send({
				embed: {
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Bewerben",
					description: "Bewerbung wird in DM fortgesetzt"
				}
			})
			.catch(e => {
				message.channel.send({
					embed: {
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						color: 0xff0000,
						title: "Fehler",
						description: e.message
					}
				});
			});

		message.author
			.send({
				embed: {
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Bewerben",
					description:
						"Hallo auf GireX!\nSchön, dass du dich bewerben möchtest!\nUm die Bewerbung abzubrechen schreibe einfach: ``%cancel``\nWir stellen dir nun ein paar Fragen, die du hier beantworten kannst:"
				}
			})
			.catch(e => {
				message.channel.send({
					embed: {
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						color: 0xff0000,
						title: "Fehler",
						description: e.message
					}
				});
			});

		message.author
			.send({
				embed: {
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Bewerben",
					description:
						config.bewerbungen[t - 1].fragen.array[
							config.bewerbungen[t - 1].frage
						].frage
				}
			})
			.catch(e => {
				message.channel.send({
					embed: {
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						color: 0xff0000,
						title: "Fehler",
						description: e.message
					}
				});
			});
	}
};

module.exports.help = {
	name: "apply"
};
