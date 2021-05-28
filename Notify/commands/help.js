module.exports.run = async function(message, args, conf) {
	switch (args[0]) {
		case undefined:
			var allCommands = [];

			client.commands.forEach(e => {
				allCommands.push({
					name: data[conf].prefix + e.help.name,
					value: ln[data[conf].ln].commands[e.help.name].description
				});
			});

			message.channel.send({
				embed: {
					color: config.colors.blue,
					author: {
						name:
							ln[data[conf].ln].Interface.command +
							": " +
							this.help.name
					},
					fields: allCommands
				}
			});
			break;
		default:
			var command = client.commands.get(args[0]);

			if (command == undefined) {
				message.channel.send({
					embed: {
						color: config.colors.blue,
						author: {
							name:
								ln[data[conf].ln].Interface.command +
								": " +
								this.help.name +
								" " +
								args[0]
						},
						title: ln[data[conf].ln].Interface.unkownCommand
					}
				});
			} else {
				message.channel
					.send({
						embed: {
							color: config.colors.blue,
							author: {
								name:
									ln[data[conf].ln].Interface.command +
									": " +
									this.help.name +
									" " +
									args[0]
							},
							fields: [
								{
									name: ln[data[conf].ln].Interface.name,
									value: command.help.name
								},
								{
									name: ln[data[conf].ln].Interface.description,
									value: command.help.description
								},
								{
									name: ln[data[conf].ln].Interface.help,
									value: command.help.help
								}
							]
						}
					})
					.catch(e => {
						console.error(e);
					});
			}
			break;
	}
};

module.exports.help = {
	name: "help",
	help: "``help [command]``"
};
