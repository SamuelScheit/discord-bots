module.exports.warn = function(user) {
	warn(user);
};

function warn(user) {
	var w = config.warns.find(x => x.user == user.user.id);

	if (w) {
		w.warns++;
	} else {
		w =
			config.warns[
				config.warns.push({ user: user.user.id, warns: 1 }) - 1
			];
	}

	return w.warns;
}

module.exports.run = async function(message, args, conf) {
	switch (args[0]) {
		case "remove":
			if (message.mentions.users.array().length <= 0) {
				message.channel.send({
					embed: {
						color: 0x808080,
						title: "Fehler",
						description: "Nutzer nicht gefunden!"
					}
				});
			} else {
				if (args[1] == undefined || args[2] == undefined) {
					message.channel.send({
						embed: {
							color: 0x808080,
							title: "Hilfe: " + this.help.name,
							description: this.help.help
						}
					});
				} else {
					var user = client.guilds
						.first()
						.member(message.mentions.users.first().id);

					var w = config.warns.find(x => x.user == user.user.id);

					if (w == undefined) {
						var warns = 0;
						message.channel.send({
							embed: {
								color: 0x808080,
								title: user.user.username + " has now 0 warns",
								description: "<@" + user.user.id + ">"
							}
						});
					} else {
						var remove = parseInt(args[2]);

						if (isNaN(remove)) {
							message.channel.send({
								embed: {
									color: 0x808080,
									title: "Fehler",
									description: "Ungültige Anzahl: " + args[2]
								}
							});
						} else {
							w.warns -= remove;

							if (w.warns < 0) {
								w.warns = 0;
							}

							message.channel.send({
								embed: {
									color: 0x808080,
									title:
										"Der User " +
										user.user.username +
										" wurde gewarnt und hat " +
										w.warns +
										" warns",
									description: "<@" + user.user.id + ">"
								}
							});
						}
					}
				}
			}
			break;
		case "info":
			if (message.mentions.users.array().length <= 0) {
				message.channel.send({
					embed: {
						color: 0x808080,
						title: "Fehler",
						description: "Nutzer nicht gefunden!"
					}
				});
			} else {
				var user = client.guilds
					.first()
					.member(message.mentions.users.first().id);

				var w = config.warns.find(x => x.user == user.user.id);

				if (w == undefined) {
					var warns = 0;
				} else {
					var warns = w.warns;
				}

				message.channel.send({
					embed: {
						color: 0x808080,
						title: user.user.username + " has " + warns + " warns",
						description: "<@" + user.user.id + ">"
					}
				});
			}
			break;
		case undefined:
			message.channel.send({
				embed: {
					color: 0x808080,
					title: this.help.name + ": Fehler! Hilfe:",
					description: this.help.help
				}
			});
			break;
		default:
			if (message.mentions.users.array().length <= 0) {
				message.channel.send({
					embed: {
						color: 0x808080,
						title: "Fehler beim Warnen",
						description: "Nutzer nicht gefunden!"
					}
				});
			} else {
				var user = client.guilds
					.first()
					.member(message.mentions.users.first().id);

				var warns = warn(user);

				message.channel.send({
					embed: {
						color: 0x808080,
						title:
							"Warned " +
							user.user.username +
							" for you\nThis is the " +
							warns +
							". Warn",
						description: "<@" + user.user.id + ">"
					}
				});

				if (warns == 3) {
					user.kick();
					message.channel.send({
						embed: {
							color: 0x808080,
							title:
								"Kick " +
								user.user.username +
								" for for the 3. Warn\n",
							description: "<@" + user.user.id + ">"
						}
					});
				}

				if (warns >= 5) {
					user.ban();
					message.channel.send({
						embed: {
							color: 0x808080,
							title:
								"Banned " +
								user.user.username +
								" for for the 5. Warn\n",
							description: "<@" + user.user.id + ">"
						}
					});
				}

				console.log("Warn: " + user.user.id + " " + user.user.username);
			}
			break;
	}
};

module.exports.help = {
	name: "warn",
	description: "Warns a user",
	help: "``warn [user]\nwarn info [user]\nwarn remove [user] [anzahl]``"
};
