global.config.reports = [];

module.exports.run = function(message, args) {
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

	if (args[0] == undefined) {
		message.channel.send({
			embed: {
				color: 0xff0000,
				title: "Report: Fehler",
				thumbnail: {
					url: client.user.avatarURL
				},
				description: "Bitte nenne einen Spieler!"
			}
		});
		return 1;
	}

	if (args[1] == undefined) {
		message.channel.send({
			embed: {
				color: 0xff0000,
				title: "Report: Fehler",
				thumbnail: {
					url: client.user.avatarURL
				},
				description: "Bitte nenne einen Grund!"
			}
		});
		return 1;
	}

	var u = message.guild.members.find(x => x.id == message.author.id);

	if (u == undefined) {
		message.channel.send({
			embed: {
				color: 0xff0000,
				title: "Report: Fehler",
				thumbnail: {
					url: client.user.avatarURL
				},
				description: "Du musst dich auf dem Discord Server befinden!"
			}
		});
		return 1;
	}

	if (args[0].startsWith("<")) {
		if (message.mentions.users.size > 0) {
			u = message.guild.members.find(
				x => x.user.id == message.mentions.users.first().id
			).id;
		} else {
			u = args[0].replace("<@", "").replace(">", "");
		}
	} else if (args[0].startsWith("@")) {
		u = args[0].replace("@", "");
		u = message.guild.members.find(x => x.user.tag == u).id;
	}

	if (u == undefined) {
		message.channel.send({
			embed: {
				color: 0xff0000,
				title: "Report: Fehler",
				thumbnail: {
					url: client.user.avatarURL
				},
				description: "Nutzer nicht gefunden!"
			}
		});
		return 1;
	}

	config.reports.push({
		fromUser: message.author.id,
		reportedUser: u,
		grund: args.slice(1).join(" ")
	});
	message.channel.send({
		embed: {
			color: 0x00ff00,
			title: "Report",
			thumbnail: {
				url: client.user.avatarURL
			},
			description:
				"<@&539419982090469407><@&530404628316160000>: <@" +
				u +
				"> wurde von <@" +
				message.author.id +
				"> gemeldet.\nGrund: " +
				args.slice(1).join(" ")
		}
	});
};

module.exports.help = {
	name: "report",
	description: "Report a user",
	help: "``report [user]``"
};
