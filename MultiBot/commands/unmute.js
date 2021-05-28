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
						title: "Fehler beim unmuten",
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

				var muted = client.guilds
					.first()
					.roles.array()
					.find(x => x.name === "Muted");

				if (muted == undefined) {
					message.channel.send({
						embed: {
							color: 0x0000ff,
							title: this.help.name + ": Fehler!",
							description:
								"Bitte erstelle eine Rolle ``Muted`` mit keinen Berechtigungen!"
						}
					});
				} else {
					user.removeRole(muted)
						.then(x => {
							if (error == false) {
								message.channel.send({
									embed: {
										color: 0x0000ff,
										title:
											"Unmuted " +
											user.user.username +
											" for you 😘",
										description: "<@" + user.user.id + ">"
									}
								});
							}
						})
						.catch(e => {
							error = true;
							message.channel.send({
								embed: {
									color: 0x0000ff,
									title: "Fehler beim Unmuten",
									description:
										args[0] +
										" konnte nicht geunmuted werden\nFehler: " +
										e.message
								}
							});
						});
					console.log(
						"Unmute: " + user.user.id + " " + user.user.username
					);
				}
			}
			break;
	}
};

module.exports.help = {
	name: "unmute",
	description: "Unmutes a user",
	help: "``unmute [user]``"
};
