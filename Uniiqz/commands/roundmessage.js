module.exports.run = async function(message, args, conf) {
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

			message.mentions.roles.first().members.forEach(e => {
				e.send({
					embed: {
						color: 0xff0000,
						title:
							"Roundmessage an " +
							message.mentions.roles.first().name,
						thumbnail: {
							url: client.user.avatarURL
						},
						description: message.content.slice(
							prefix.length + this.help.name.length + 24
						)
					}
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
