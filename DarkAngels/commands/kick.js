module.exports.run = async function(message, args, conf) {
	switch (args[0]) {
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
						title: "Fehler beim kicken",
						description: args.join(" ") + " nicht gefunden!"
					}
				});
			} else {
				var user = client.guilds
					.first()
					.members.find(
						x => x.user.id == message.mentions.users.first().id
					);

				var error = false;

				user.kick()
					.then(x => {
						if (error == false) {
							message.channel.send({
								embed: {
									color: 0x808080,
									title:
										"Der User " +
										user.user.username +
										" wurde gekickt",
									description: "<@" + user.user.id + ">"
								}
							});
						}
					})
					.catch(e => {
						error = true;
						message.channel.send({
							embed: {
								color: 0x808080,
								title: "Fehler beim Kicken",
								description:
									args[0] +
									" konnte nicht gekickt werden\nFehler: " +
									e.message
							}
						});
					});
				console.log("Kick: " + user.user.id + " " + user.user.username);
			}
			break;
	}
};

module.exports.help = {
	name: "kick",
	description: "Kicks a user",
	help: "``kick [user]``"
};
