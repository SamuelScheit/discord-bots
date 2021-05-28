module.exports.run = async function(message, args, conf) {
	switch (args[0]) {
		case undefined:
			var field = "";

			client.guilds
				.first()
				.fetchBans()
				.then(x => {
					x.forEach(e => {
						field +=
							"<@" +
							e.id +
							">     " +
							e.username +
							"#" +
							e.discriminator +
							"\n";
					});

					message.channel.send({
						embed: {
							color: 0x0000ff,
							title: "Unban: Hilfe:",
							description: this.help.help,
							fields: [
								{
									name: "Gebannte Accounts",
									value: field
								}
							]
						}
					});
				});
			break;
		default:
			var error = false;
			var user = args.join(" ").replace(/[@<>]/g, "");

			client.guilds
				.first()
				.fetchBans()
				.then(x => {
					if (x.find(x => x.id == user)) {
						user = x.find(x => x.id == user);
					}
					if (x.find(x => x.username == user)) {
						user = x.find(x => x.username == user);
					}
					if (
						x.find(x => x.username + "#" + x.discriminator == user)
					) {
						user = x.find(
							x => x.username + "#" + x.discriminator == user
						);
					}

					if (typeof user === "string" || user instanceof String) {
						message.channel.send({
							embed: {
								color: 0x0000ff,
								title: "Fehler beim Unban",
								description: user + " nicht gefunden"
							}
						});
					} else {
						client.guilds
							.first()
							.unban(user.id)
							.then(x => {
								if (error == false) {
									message.channel.send({
										embed: {
											color: 0x0000ff,
											title:
												"Unbanned " +
												user.username +
												" for you 😘",
											description: "<@" + user.id + ">"
										}
									});
								}
							})
							.catch(e => {
								error = true;
								message.channel.send({
									embed: {
										color: 0x0000ff,
										title: "Fehler beim Unban",
										description:
											user +
											" konnte nicht unbannt werden\nFehler: " +
											e.message
									}
								});
							});
						console.log("Unban: " + user.id + " " + user.username);
					}
				});
			break;
	}
};

module.exports.help = {
	name: "unban",
	description: "Unbans a user",
	help: "``unban [user]``"
};
