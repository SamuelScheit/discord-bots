module.exports.run = function (message, args) {
	if (message.channel.type == "dm")
		return message.channel
			.send({
				embed: {
					color: 0xff0000,
					title: "Error",
					thumbnail: {
						url: client.user.avatarURL
					},
					description:
						"You can only execute this command on the server!"
				}
			})
			.then(x => setTimeout(() => x.delete(), 3000));

	switch (args[0]) {
		case undefined: //!support
			var ticket = config.support.find(x => x == message.author.id);

			if (ticket)
				return message.channel.send({
					embed: {
						color: 0xff0000,
						title: "Error",
						description: "You already have a Support Ticket!"
					}
				}).then(x => setTimeout(() => x.delete(), 3000));;

			message.channel.send({
				embed: {
					color: 0x808080,
					title: "Support requested",
					description:
						message.author.username +
						" be patient.\nYour request will be sent to an Agent."
				}
			});

			message.guild.roles
				.find(x => x.id == "568185571168485388")
				.members.forEach(function (user) {
					user.send(
						"The User " +
						message.author.username +
						" needs Support.\nYou can help him with !support @" +
						message.author.username +
						" in <#568188821842427914>"
					);
				});

			setTimeout(() => {
				message.delete();
			}, 3000);

			config.support.push(message.author.id);
			break;
		case "close":
			if (message.channel.name.toLowerCase().indexOf("➤support-") == -1)
				return false;

			message.channel.send({
				embed: {
					color: 0x808080,
					title: "Support Closed",
					description:
						"The Support Ticket was closed by <@" +
						message.author.id +
						">"
				}
			});

			message.guild.roles
				.find(x => x.name == message.channel.name)
				.delete();

			setTimeout(() => {
				message.channel.delete();
			}, 5000);

			break;
		default:
			//accept support
			var member = message.mentions.users.first();

			message.guild.channels
				.find(x => x.id == "568188821842427914")
				.fetchMessages({ limit: 100 })
				.then(messages => {
					messages.forEach(msg => {
						if (msg.embeds[0] != undefined) {
							if (
								msg.embeds[0].description.indexOf(
									member.username
								) != -1
							) {
								msg.delete();
							}
						}
					});
				});

			if (member == undefined)
				return message.channel.send({
					embed: {
						color: 0x808080,
						title: this.help.name + ": Help/User not found",
						description: this.help.help
					}
				}).then(x => setTimeout(() => x.delete(), 3000));;

			var ticket = config.support.find(x => x == member.id);

			if (ticket == undefined)
				return message.channel.send({
					embed: {
						color: 0x808080,
						description:
							"<@" +
							member.id +
							"> has not asked for support!"
					}
				}).then(x => setTimeout(() => x.delete(), 3000));;

			message.guild
				.createChannel("➤support-" + member.username, "text")
				.then(channel => {
					channel.setParent("568194686888444053");
					message.guild.createRole({ name: channel.name }).then(x => {
						channel.overwritePermissions(
							client.guilds
								.first()
								.roles.array()
								.find(y => y.name == "@everyone"),
							{
								'SEND_MESSAGES': false,
								'VIEW_CHANNEL': false,
								'READ_MESSAGES': false,
								'CREATE_INSTANT_INVITE': false,
								'MANAGE_CHANNELS': false,
								'EMBED_LINKS': false,
								'ATTACH_FILES': false,
							}
						).then(h => {
							console.log(h);
						});

						channel.overwritePermissions(x, {
							'SEND_MESSAGES': true,
							'VIEW_CHANNEL': true,
							'READ_MESSAGES': true,
							'CREATE_INSTANT_INVITE': true,
							'MANAGE_CHANNELS': true,
							'EMBED_LINKS': true,
							'ATTACH_FILES': true,
						}).then(h => {
							console.log(h);
						});

						client.guilds
							.first()
							.member(member.id)
							.addRole(x).then(role => {
								console.log(role);
							}).catch(e => {
								console.log(e);
							});

						message.member.addRole(x).then(role => {
							console.log(role);
						}).catch(e => {
							console.log(e);
						});
					});

					channel.send(
						"Dear <@" +
						member.id +
						"> ,\nyou now have a Supporter that helps you.\nAll messages that are sent in this channel, will be treated with discretion"
					);

					message.guild
						.member(member.id)
						.send(
							"Hi <@" +
							message.author.id +
							"> has accepted your Support Ticket!\n<#" +
							channel.id +
							"> is the Support Chat"
						);
				});

			config.support.splice(config.support.indexOf(member.id), 1);

			setTimeout(() => {
				message.delete();
			}, 3000);

			break;
	}
};

module.exports.help = {
	name: "support",
	description: "Manage Support",
	help: "``support\nsupport [user]\nsupport close``"
};
