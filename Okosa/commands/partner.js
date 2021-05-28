module.exports.init = function() {
	setInterval(() => {
		config.partner.forEach(p => {
			if (new Date().getTime() - p.last > 172800000) {
				client.guilds
					.first()
					.channels.get("563090581304246309")
					.send({
						embed: {
							author: {
								name: client.guilds.first().member(p.user).user
									.username,
								icon_url: client.guilds.first().member(p.user)
									.user.avatarURL
							},
							description: p.text
						}
					});
				p.last = new Date().getTime();
			}
		});
	}, 1000 * 20);

	client.on("messageReactionAdd", (reaction, user) => {
		if (user.id === client.user.id) return false;

		if (reaction.message.author.id !== client.user.id) return false;

		if (
			reaction.message.content.indexOf("Neue Partner Bewerbung von") == -1
		) {
			return false;
		}

		if (member.highestRole.id == "567023628747669549")
			return reaction.message.channel.send(
				"Fehler: Nutzer hat nicht die Partnerphaserolle er wurde wahrscheinlich schon angeommen"
			);

		console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
		var i = reaction.message.content.indexOf("@") + 1;
		var e = reaction.message.content.indexOf(">");
		var userid = reaction.message.content.slice(i, e);
		var member = client.guilds.first().member(userid);

		if (member === null)
			return reaction.message.channel.send(
				"Fehler Nutzer nicht gefunden: " + userid
			);

		member.removeRole("567023628747669549").catch(e => console.error(e));

		switch (reaction.emoji.name) {
			case "❌":
				member.send(
					"Die Anforderungen für eine Partnerschaft haben leider nicht gereicht!"
				);
				user.send("Erfolgreich abgelehnt");
				break;
			case "✅":
				member.send(
					"Du bist nun akzeptiert mit deinem Discord, bitte geb mir die Partner Rolle, damit du bei uns Partner bist, schreib in <#567021931505778696> mit ```!partner text [Text]``` deinen Text, er wird dann 3x die Woche gepostet."
				);
				member.addRole("530351414636052480");
				user.send("Erfolgreich angenommen");
				break;
		}
	});

	client.on("messageReactionRemove", (reaction, user) => {
		if (user.id !== client.user.id) {
			console.log(
				`${user.username} removed their "${
					reaction.emoji.name
				}" reaction.`
			);
		}
	});
};

module.exports.run = function(message, args) {
	switch (args[0]) {
		case "add":
			if (message.channel.id != "563090475448533024")
				return message.channel
					.send({
						embed: {
							color: 0xff0000,
							title: "Partner: Fehler",
							thumbnail: {
								url: client.user.avatarURL
							},
							description:
								"Du kannst diesen Befehl nur in <#563090475448533024> ausführen!"
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));

			if (args[1] == undefined) {
				message.channel
					.send({
						embed: {
							color: 0xff0000,
							title: "Partner: Fehler",
							thumbnail: {
								url: client.user.avatarURL
							},
							description: this.help.help
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));
			} else {
				var invite = args[1].replace("https://discord.gg/", "");
				client
					.fetchInvite(invite)
					.then(x => {
						if (x.memberCount >= 300) {
							message.channel
								.send({
									embed: {
										color: 0x00ff00,
										title: "Partner: Erfolgreich",
										thumbnail: {
											url: client.user.avatarURL
										},
										description:
											"Ihr seid nun in der Partnertestphase und müsst warten, bis euch der Leader anschreibt!"
									}
								})
								.then(x => setTimeout(() => x.delete(), 3000));
							message.member.addRole("567023628747669549");
							invite = args[1];

							message.guild.roles
								.filter(
									x =>
										x.id == "530180933647597578" ||
										x.id == "539419982090469407" ||
										x.id == "534744418184593418" ||
										x.id == "530404628316160000"
								)
								.forEach(role => {
									role.members.forEach(member => {
										sendPartnerNotify(
											member,
											invite,
											message.member
										);
									});
								});

							sendPartnerNotify(
								message.guild.members.find(
									x => x.id == "371980884242464780"
								),
								invite,
								message.member
							);

							sendPartnerNotify(
								message.guild.members.find(
									x => x.id == "311129357362135041"
								),
								invite,
								message.member
							);
						} else {
							message.channel
								.send({
									embed: {
										color: 0xff0000,
										title: "Partner: Fehler",
										thumbnail: {
											url: client.user.avatarURL
										},
										description:
											"Du hast zu wenig Member!\nDu brauchst mindestens 300 User!"
									}
								})
								.then(x => setTimeout(() => x.delete(), 3000));
						}
						console.log(x);
					})
					.catch(e => {
						message.channel
							.send({
								embed: {
									color: 0xff0000,
									title: "Partner: Fehler",
									thumbnail: {
										url: client.user.avatarURL
									},
									description: "Ungültiger Invite!"
								}
							})
							.then(x => setTimeout(() => x.delete(), 3000));
						console.error(e);
					});
			}
			break;
		case "text":
			if (message.channel.id != "567021931505778696")
				return message.channel
					.send({
						embed: {
							color: 0xff0000,
							title: "Partner: Fehler",
							thumbnail: {
								url: client.user.avatarURL
							},
							description:
								"Du kannst diesen Befehl nur in <#567021931505778696> ausführen!"
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));
			if (args[1] == undefined) {
				message.channel
					.send({
						embed: {
							color: 0xff0000,
							title: "Partner: Fehler",
							thumbnail: {
								url: client.user.avatarURL
							},
							description: this.help.help
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));
			} else {
				if (
					message.member.roles.find(
						x => x.id == "530351414636052480"
					) == null
				) {
					message.channel
						.send({
							embed: {
								color: 0xff0000,
								title: "Partner: Fehler",
								thumbnail: {
									url: client.user.avatarURL
								},
								description: "Du hast nicht die Partner Rolle!"
							}
						})
						.then(x => setTimeout(() => x.delete(), 3000));
				} else {
					var p = config.partner.find(
						x => x.user == message.author.id
					);
					var text = message.content.replace("!partner text ", "");

					if (p == undefined) {
						config.partner.push(
							new partner(message.author.id, text)
						);
					} else {
						p.text = text;
					}
					message.channel
						.send({
							embed: {
								color: 0x00ff00,
								title:
									"Partner: Erfolgreich text geupdatet zu:",
								thumbnail: {
									url: client.user.avatarURL
								},
								description: text
							}
						})
						.then(x => setTimeout(() => x.delete(), 5000));
				}
			}
			break;
		case "remove":
			if (message.channel.type == "dm")
				return message.channel
					.send({
						embed: {
							color: 0xff0000,
							title: "Partner: Fehler",
							thumbnail: {
								url: client.user.avatarURL
							},
							description:
								"Du kannst diesen Befehl nur auf dem Server ausführen!"
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));

			try {
				if (!message.member.hasPermission(8)) {
					message.channel.send({
						embed: {
							color: 0xff0000,
							title: "Partner: Fehler",
							thumbnail: {
								url: "Du hast keine Admin Permissions"
							}
						}
					});
				}

				var userid = message.mentions.users.first().id;
				var member = client.guilds.first().member(userid);

				member
					.removeRole("530351414636052480")
					.catch(e => console.error(e));

				config.partner.splice(
					config.partner.find(x => x.user == userid),
					1
				);

				message.channel
					.send({
						embed: {
							color: 0x00ff00,
							title: "Partner: Erfolgreich gelöscht!",
							thumbnail: {
								url: client.user.avatarURL
							}
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));
			} catch (e) {
				message.channel
					.send({
						embed: {
							color: 0xff0000,
							title: "Partner: Fehler",
							thumbnail: {
								url: client.user.avatarURL
							},
							description: e.message
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));
			}

			break;
		case undefined:
			message.channel
				.send({
					embed: {
						color: 0xff0000,
						title: "Partner: Hilfe",
						thumbnail: {
							url: client.user.avatarURL
						},
						description: this.help.help
					}
				})
				.then(x => setTimeout(() => x.delete(), 3000));
			break;
	}
};

module.exports.help = {
	name: "partner",
	description: "Manage the partner",
	help:
		"mögliche Kommandos:\n```!partner add [invite link]\n!partner text [text]\n!partner remove [user]```"
};

function partner(user, text) {
	this.user = user;
	this.text = text;
	this.last = 0;
}

global.sendPartnerNotify = function(member, invite, from) {
	member
		.send(
			"Neue Partner Bewerbung von <@" +
				from.user.id +
				"> für den DC: " +
				invite
		)
		.then(msg => {
			msg.react("✅");
			msg.react("❌");
		});
};
