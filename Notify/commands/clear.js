module.exports.run = async function(message, args, conf) {
	if (message.member.hasPermission(8192)) {
		message.channel
			.send({
				embed: {
					color: config.colors.red,
					author: {
						name: ln[data[conf].ln].commands.clear.sureDelete
					}
				}
			})
			.then(m => {
				m.react("✅");
				m.react("❌");

				var collector = m.createReactionCollector((reaction, user) => {
					if (user.id != client.user.id) {
						reaction.remove(user);
					}
					return user.id != client.user.id;
				}, {});

				collector.on("collect", (reaction, ReactionCollector) => {
					collector.filter = function() {
						return false;
					};

					switch (reaction.emoji.name) {
						case "✅":
							async function clear() {
								console.log("clear");
								const fetched = await message.channel.fetchMessages(
									{
										limit: 99
									}
								);
								message.channel.bulkDelete(fetched).then(() => {
									if (fetched.size > 0) {
										clear();
									}
								});
							}
							clear();
							break;
						case "❌":
							message.delete();
							reaction.message.delete();
							break;
					}
				});
			});
	} else {
		message.channel.send({
			embed: {
				color: 16777215,
				author: {
					name: ln[data[conf].ln].Interface.noPermissionCommand
				}
			}
		});
	}
};

module.exports.help = {
	name: "clear",
	help: "``clear [channel]``"
};
