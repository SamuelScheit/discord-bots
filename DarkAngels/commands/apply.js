module.exports.init = function() {
	client.on("messageReactionAdd", (reaction, user) => {
		if (user.id === client.user.id) return false;

		if (reaction.message.author.id !== client.user.id) return false;

		if (
			reaction.message.embeds[0] != undefined &&
			reaction.message.embeds[0].title == "Bewerbungen"
		) {
			var text = reaction.message.embeds[0].description;

			var i = text.indexOf("@") + 1;
			var e = text.indexOf(">");
			var userid = text.slice(i, e);
			var member = client.guilds.first().member(userid);

			if (member === null)
				return reaction.message.channel.send(
					"Fehler Nutzer nicht gefunden: " + userid
				);

			if (member.roles.find(x => x.id == "545716021562966019")) {
				return reaction.message.channel.send(
					"Fehler: Nutzer hat schon Warteliste Rolle"
				);
			}

			switch (reaction.emoji.name) {
				case "❌":
					member.send(
						"Deine Bewerbung wurde bearbeitet, aber die Anforderungen haben leider nicht gereicht!"
					);
					user.send("Erfolgreich abgelehnt");
					break;
				case "✅":
					member.send(
						"Deine Bewerbung wurde nun bearbeitet und akzeptiert, du erhählst den Wartelisten Rang.\nDu musst nur noch ein <#546005852579037185>!"
					);

					member
						.addRole("545716021562966019")
						.then(x =>
							user.send("Erfolgreich zur Warteliste hinzugefügt")
						)
						.catch(e => {
							console.error(e);
							user.send("Fehler beim hinzufügen zur Warteliste");
						});
					break;
			}
		}
	});
};

var frage = function(f, a) {
	this.frage = f;
	this.antwort = "";
};

var fragen = function() {
	this.array = [
		new frage("Wie heißt du ingame?"),
		new frage("Wie heißt du?"),
		new frage("Wie alt bist du?"),
		new frage("Auf welcher Platform spielst du?"),
		new frage("Wie lang bist du täglich online?"),
		new frage("Wie viele Spiele hast du Lifetime gespielt?"),
		new frage("Welche Lifetime K/D hast du?"),
		new frage("Wie viele Wins hast du Lifetime?"),
		new frage("Wie hast du unseren Clan gefunden?"),
		new frage("Warum sollten wir genau dich nehmen?")
	];
};

module.exports.dm = function(message) {
	var t = config.bewerbungen.find(x => x.user == message.author.id);

	if (message.content == prefix + "cancel")
		return message.channel.send("Bewerbung abgebrochen");

	t.fragen.array[t.frage].antwort = message.content;
	t.frage++;

	if (t.frage == t.fragen.array.length) {
		var fields = [];

		config.bewerbungen
			.find(x => x.user == message.author.id)
			.fragen.array.forEach(x => {
				fields.push({
					name: x.frage,
					value: x.antwort
				});
			});

		message.channel
			.send({
				embed: {
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Bewerbung abgeschlossen",
					fields: fields
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

		var moderators = client.guilds
			.first()
			.roles.filter(
				x =>
					x.id == "511915484371746817" || x.id == "511915434157670429"
			);

		moderators.forEach(role => {
			role.members.array().forEach(x => {
				x.send({
					embed: {
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						title: "Bewerbungen",
						description: "Bewerber: <@" + t.user + ">",
						fields: fields
					}
				})
					.then(x => {
						x.react("✅");
						x.react("❌");
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
			});
		});

		config.bewerbungen.splice(
			config.bewerbungen.findIndex(x => x.user == message.author.id),
			1
		);
	} else {
		message.author
			.send({
				embed: {
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Bewerben",
					description: t.fragen.array[t.frage].frage
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

module.exports.run = function(message, args) {
	if (message.channel.id !== "568020834216837120")
		return message.channel
			.send({
				embed: {
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					color: 0xff0000,
					title: client.user.username + " Bewerben",
					description:
						"Dies kannst du nur in <#568020834216837120> ausführen!"
				}
			})
			.then(x => setTimeout(() => x.delete(), 3000));

	if (config.bewerbungen.find(x => x.user == message.author.id)) {
		message.channel
			.send(
				"Du hast bereits eine Bewerbung offen! schließe sie mit ``" +
					prefix +
					"cancel``"
			)
			.then(x => setTimeout(() => x.delete(), 3000))
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
			.then(x => setTimeout(() => x.delete(), 3000))
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
						"Hallo auf " +
						message.guild.name +
						"!\nSchön, dass du dich bewerben möchtest!\nUm die Bewerbung abzubrechen schreibe einfach: ``" +
						prefix +
						"cancel``\nWir stellen dir nun ein paar Fragen, die du hier beantworten kannst:"
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
	name: "apply",
	description: "Apply for the clan",
	help: "``apply``"
};
