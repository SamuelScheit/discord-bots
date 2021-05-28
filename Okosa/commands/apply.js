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

			if (member.highestRole.id == "564221380158291978")
				return reaction.message.channel.send(
					"Fehler: Nutzer hat schon bewerber Rolle"
				);

			switch (reaction.emoji.name) {
				case "❌":
					member.send(
						"Deine Bewerbung wurde bearbeitet, aber die Anforderungen haben leider nicht gereicht!"
					);
					user.send("Erfolgreich abgelehnt");
					break;
				case "✅":
					member.send(
						"Deine Bewerbung wurde nun bearbeitet und akzeptiert, du erhählst den Bewerber Rang und demnächst eine Nachricht von den Testern für ein Tryout"
					);

					member
						.addRole("564221380158291978")
						.then(x =>
							user.send("Erfolgreich als Bewerber angenommen")
						)
						.catch(e => {
							console.error(e);
							user.send("Fehler beim annehmen als Bewerber");
						});

					var moderators = client.guilds
						.first()
						.members.filter(
							x => x.highestRole.id == "566273240251760670"
						)
						.array();

					moderators.push(
						client.guilds.first().member("311129357362135041")
					);

					moderators.push(
						client.guilds.first().member("371980884242464780")
					);

					moderators.forEach(x => {
						x.send({
							embed: {
								author: {
									name: client.user.username,
									icon_url: client.user.avatarURL
								},
								title: "Tester: neuer Bewerber",
								description:
									"Bewerber: <@" + member.user.id + ">",
								fields: reaction.message.embeds[0].fields
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
					break;
			}
		} else if (
			reaction.message.embeds[0] != undefined &&
			reaction.message.embeds[0].title == "Tester: neuer Bewerber"
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

			if (
				member.roles.find(x => x.id == "564221380158291978") ==
				undefined
			)
				return reaction.message.channel.send(
					"Fehler: Nutzer hat nicht bewerber Rolle"
				);

			switch (reaction.emoji.name) {
				case "❌":
					member.send(
						"Du konntest den Tester leider nicht überzeugen!"
					);
					user.send("Erfolgreich abgelehnt");
					member.removeRole("564221380158291978");
					break;
				case "✅":
					member.send(
						"Du konntest den Tester überzeugen und erhählst den Test Member Rang"
					);
					member.addRole("536639962783940648");
					user.send("Erfolgreich als Test Member angenommen");
					break;
			}
		}
	});
};

var frage = function(f) {
	this.frage = f;
	this.antwort = "";
};

var fragen = function() {
	this.array = [
		new frage("Wie heißt du?"),
		new frage("Wie alt bist du?"),
		new frage("Warum möchtest du Rouve eSports joinen?"),
		new frage("Wie viele Wins hast du ca.?"),
		new frage("Was gefällt dir so an Rouve eSports?"),
		new frage("Was ist/war deine höchste Punktzahl in Arena Solo/Duo?"),
		new frage("Was macht dich besonders?"),
		new frage("Hast du einen Duo Mate, wenn ja wie heißt er?")
	];
};

module.exports.dm = function(message) {
	var t = config.bewerbungen.find(x => x.user == message.author.id);

	if (message.content == prefix + "cancel") return false;
	t.fragen.array[t.frage].antwort = message.content;
	t.frage++;

	if (t.frage == t.fragen.array.length) {
		var fields = [];

		t.fragen.array.forEach(x => {
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
			.members.filter(x => x.highestRole.id == "534744418184593418")
			.array();

		moderators.push(client.guilds.first().member("311129357362135041"));
		moderators.push(client.guilds.first().member("371980884242464780"));

		moderators.forEach(x => {
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
	if (message.channel.id !== "563088463059222528")
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
						"Dies kannst du nur in <#563088463059222528> ausführen!"
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
