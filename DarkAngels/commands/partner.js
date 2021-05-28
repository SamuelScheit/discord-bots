module.exports.init = function() {
	setInterval(() => {
		config.partner.forEach(p => {
			if (new Date().getTime() - p.last > 172800000) {
				client.guilds
					.first()
					.channels.get("560178411059019777")
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

		var i = reaction.message.content.indexOf("@") + 1;
		var e = reaction.message.content.indexOf(">");
		var userid = reaction.message.content.slice(i, e);
		var member = client.guilds.first().member(userid);

		if (member === null)
			return reaction.message.channel.send(
				"Fehler Nutzer nicht gefunden: " + userid
			);

		if (member.highestRole.id == "568784491032608778")
			return reaction.message.channel.send(
				"Fehler: Nutzer hat nicht die Partnerphaserolle er wurde wahrscheinlich schon angeommen"
			);

		member.removeRole("568784491032608778").catch(e => console.error(e));

		switch (reaction.emoji.name) {
			case "❌":
				member.send(
					"Die Anforderungen für eine Partnerschaft haben leider nicht gereicht!\nVersuche es bitte erst in einem Monat erneut!\nHier sind die Anforderungen: <#555727378316263434>"
				);
				user.send("Erfolgreich abgelehnt");
				break;
			case "✅":
				member.send(
					"Du bist nun akzeptiert mit deinem Discord, bitte gib <@308303684796809216> die Partner Rolle, damit du bei uns Partner bist, schreib in <#560178606291288074> mit ```!partner text [Text]``` deinen Text, er wird dann 3x die Woche gepostet."
				);
				member.addRole("538428937290907668");
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
			if (message.channel.id != "560178606291288074")
				return message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Fehler",
							description:
								"Du kannst diesen Befehl nur in <#560178606291288074> ausführen!"
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});

			if (args[1] == undefined) {
				message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Fehler",
							description: this.help.help
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});
			} else {
				var invite = args[1].replace("https://discord.gg/", "");

				message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Erfolgreich",
							description:
								"Ihr seid nun in der Partnertestphase und müsst warten, bis euch der Leader anschreibt!"
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});

				message.member.addRole("568784491032608778");
				invite = args[1];

				message.guild.roles
					.filter(x => x.id == "562308764800122917")
					.forEach(role => {
						role.members.forEach(member => {
							sendPartnerNotify(member, invite, message.member);
						});
					});
			}
			break;
		case "text":
			if (message.channel.id != "560178606291288074")
				return message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Fehler",
							description:
								"Du kannst diesen Befehl nur in <#560178606291288074> ausführen!"
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});
			if (args[1] == undefined) {
				message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Fehler",
							description: this.help.help
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});
			} else {
				if (
					message.member.roles.find(
						x => x.id == "538428937290907668"
					) == null
				) {
					message.channel
						.send({
							embed: {
								color: 0x808080,
								title: "Partner: Fehler",
								description: "Du hast nicht die Partner Rolle!"
							}
						})
						.then(msg => {
							setTimeout(m => m.delete(), 10000, msg);
						});
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
								color: 0x808080,
								title:
									"Partner: Erfolgreich text geupdatet zu:",
								description: text
							}
						})
						.then(msg => {
							setTimeout(m => m.delete(), 10000, msg);
						});
				}
			}
			break;
		case "remove":
			if (message.channel.type == "dm")
				return message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Fehler",
							description:
								"Du kannst diesen Befehl nur auf dem Server ausführen!"
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});

			try {
				if (
					message.member.roles.find(x => x.id == "562308764800122917")
				) {
					message.channel
						.send({
							embed: {
								color: 0x808080,
								title: "Partner: Fehler",
								description: "Du hast keine Admin Permissions"
							}
						})
						.then(msg => {
							setTimeout(m => m.delete(), 10000, msg);
						});
				}

				var userid = message.mentions.users.first().id;
				var member = client.guilds.first().member(userid);

				member
					.removeRole("538428937290907668")
					.catch(e => console.error(e));

				config.partner.splice(
					config.partner.find(x => x.user == userid),
					1
				);

				message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Erfolgreich gelöscht!"
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});
			} catch (e) {
				message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Partner: Fehler",
							description: e.message
						}
					})
					.then(msg => {
						setTimeout(m => m.delete(), 10000, msg);
					});
			}

			break;
		case undefined:
			message.channel
				.send({
					embed: {
						color: 0x808080,
						title: "Partner: Hilfe",
						description: this.help.help
					}
				})
				.then(msg => {
					setTimeout(m => m.delete(), 10000, msg);
				});
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
