function warn(user) {
	var w = config.warns.find(x => x.user == user);

	if (w) {
		w.warns++;
	} else {
		w = config.warns[config.warns.push({ user: user, warns: 1 }) - 1];
	}

	return w.warns;
}

module.exports.run = async function(message, args, conf) {
	switch (args[0]) {
		case undefined:
			message.channel.send({
				embed: {
					color: 0x0000ff,
					title: this.help.name + ": Fehler! Hilfe:",
					description: this.help.help
				}
			});
			break;
		default:
			if (message.mentions.users.array().length <= 0) {
				message.channel.send({
					embed: {
						color: 0x0000ff,
						title: "Fehler beim Warnen",
						description: "Nutzer nicht gefunden!"
					}
				});
			} else {
				var user = client.guilds
					.first()
					.members.find(
						x => x.user.id == message.mentions.users.first().id
					);

				var warns = w.warn();

				message.channel.send({
					embed: {
						color: 0x0000ff,
						title:
							"Warned " +
							user.user.username +
							" for you 😘\nThis is the " +
							warns +
							". Warn",
						description: "<@" + user.user.id + ">"
					}
				});

				console.log("Kick: " + user.user.id + " " + user.user.username);
			}
			break;
	}
};

module.exports.help = {
	name: "warn",
	description: "Warns a user",
	help: "``warn [user]``"
};
