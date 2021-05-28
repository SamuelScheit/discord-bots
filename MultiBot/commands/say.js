module.exports.run = async function(message, args, conf) {
	if (message.channel.type == "dm")
		return message.channel.send({
			embed: {
				color: 0xff0000,
				title: "Fehler",
				description:
					"Dieser Befehl kann nur auf dem Server ausgeführt werden!"
			}
		});

	if (!message.member.roles.find(x => x.id == "511915434157670429"))
		return message.channel.send({
			embed: {
				color: 0xff0000,
				title: "Fehler",
				description: "Du hast nicht die benötigten Permissions!"
			}
		});

	switch (args[0]) {
		case undefined:
			message.channel.send({
				embed: {
					color: 0x808080,
					title: this.help.name + ": Hilfe",
					description: this.help.help
				}
			});
			break;
		case "s":
			if (args[1] == undefined || args[2] == undefined)
				return message.channel.send({
					embed: {
						color: 0x808080,
						title: this.help.name + ": Hilfe",
						description: this.help.help
					}
				});

			if (message.mentions.channels.size == 0)
				return message.channel.send({
					embed: {
						color: 0x808080,
						title: this.help.name + ": Hilfe",
						description: this.help.help
					}
				});

			var channel = message.guild.channels.find(
				x => x.id == message.mentions.channels.first().id
			);

			if (channel == undefined)
				return message.channel.send({
					embed: {
						color: 0xff0000,
						title: "Fehler",
						description: "Channel nicht gefunden"
					}
				});

			message.delete();

			channel.send({
				embed: {
					color: 0x808080,
					thumbnail: {
						url: client.user.avatarURL
					},
					description: args.slice(2).join(" ")
				}
			});
			break;
		case "p":
			if (args[1] == undefined || args[2] == undefined)
				return message.channel.send({
					embed: {
						color: 0x808080,
						title: this.help.name + ": Hilfe",
						description: this.help.help
					}
				});

			if (message.mentions.roles.size == 0)
				return message.channel.send({
					embed: {
						color: 0x808080,
						title: this.help.name + ": Hilfe",
						description: this.help.help
					}
				});

			var role = message.guild.roles.find(
				x => x.id == message.mentions.roles.first().id
			);

			if (role == undefined)
				return message.channel.send({
					embed: {
						color: 0xff0000,
						title: "Fehler",
						description: "Rolle nicht gefunden"
					}
				});

			role.members.forEach(member => {
				member.send({
					embed: {
						color: 0x808080,
						thumbnail: {
							url: client.user.avatarURL
						},
						description: args.slice(2).join(" ")
					}
				});
			});
	}
};

module.exports.help = {
	name: "say",
	description: "Sends all Members of a Role a message",
	help: "``say p [role] [text]\nsay s [channel] [text]``"
};
