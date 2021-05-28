module.exports.run = async function(message, args, conf) {
	if (message.channel.type == "dm")
		return message.channel.send({
			embed: {
				color: 0xff0000,
				title: this.help.name + ": Fehler",
				thumbnail: {
					url: client.user.avatarURL
				},
				description:
					"Dieser Befehl kann nur auf dem Server ausgeführt werden!"
			}
		});

	if (!message.member.hasPermission(268435456))
		return message.channel.send({
			embed: {
				color: 0xff0000,
				title: this.help.name + ": Fehler",
				thumbnail: {
					url: client.user.avatarURL
				},
				description: "Du hast nicht die benötigten Permissions!"
			}
		});

	switch (args[0]) {
		case undefined:
			message.channel.send({
				embed: {
					color: 0xff0000,
					title: this.help.name + ": Hilfe",
					thumbnail: {
						url: client.user.avatarURL
					},
					description: this.help.help
				}
			});
			break;
		default:
			if (args[1] == undefined)
				return message.channel.send({
					embed: {
						color: 0xff0000,
						title: this.help.name + ": Hilfe",
						thumbnail: {
							url: client.user.avatarURL
						},
						description: this.help.help
					}
				});

			message.mentions.roles.forEach(role => {
				role.members.forEach(e => {
					e.send({
						embed: {
							color: 0xff0000,
							title: "Roundmessage an " + role.name,
							thumbnail: {
								url: client.user.avatarURL
							},
							description: args
								.slice(message.mentions.roles.size)
								.join(" ")
						}
					});
				});
			});

			break;
	}
};

module.exports.help = {
	name: "roundmessage",
	description: "Sends all Members of a Role a message",
	help: "``roundmessage [role] [text]``"
};
