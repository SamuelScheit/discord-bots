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
		case undefined:
			var ticket = config.tryout.find(x => x == message.author.id);

			if (ticket)
				return message.channel.send({
					embed: {
						color: 0xff0000,
						title: "Error",
						description: "You already have a tryout Ticket!"
					}
				}).then(x => setTimeout(() => x.delete(), 3000));;

			message.channel.send({
				embed: {
					color: 0x808080,
					title: "tryout requested",
					description:
						message.author.username +
						" be patient.\nYour request will be sent to an Agent."
				}
			});

			message.guild.roles
				.find(x => x.id == "568185705415704609")
				.members.forEach(function (user) {
					user.send(
						"The User " +
						message.author.username +
						" needs a Tryout.\nYou can help him with !tryout @" +
						message.author.username +
						" in <#568369772048416786>"
					);
				});

			setTimeout(() => {
				message.delete();
			}, 3000);

			config.tryout.push(message.author.id);
			break;
		case "close":
			if (message.channel.name.toLowerCase().indexOf("➤tryout-") == -1)
				return false;

			message.channel.send({
				embed: {
					color: 0x808080,
					title: "Tryout Closed",
					description:
						"The Tryout Ticket was closed by <@" +
						message.author.id +
						">"
				}
			});

			message.guild.roles
				.find(x => x.name == message.channel.name)
				.delete();

			setTimeout(() => {
				message.guild.channels
					.find(x => x.name == message.channel.name)
					.delete().then(() => {
						message.guild.channels
							.find(x => x.name == message.channel.name)
							.delete();
					});

			}, 5000);

			break;
		default:
			//accept tryout
			var member = message.mentions.users.first();

			message.guild.channels
				.find(x => x.id == "568369772048416786")
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

			var ticket = config.tryout.find(x => x == member.id);

			if (ticket == undefined)
				return message.channel.send({
					embed: {
						color: 0x808080,
						description:
							"<@" +
							member.id +
							"> has not asked for tryout!"
					}
				}).then(x => setTimeout(() => x.delete(), 3000));;

			message.guild
				.createChannel("➤tryout-" + member.username, "text")
				.then(textchannel => {
					textchannel.setParent("547716147899006986");
					message.guild.createRole({ name: textchannel.name }).then(x => {
						message.guild
							.createChannel(textchannel.name, "voice")
							.then(voicechannel => {
								voicechannel.setParent("547716147899006986");

								voicechannel.overwritePermissions(client.guilds.first().roles.array().find(y => y.name == "@everyone"), {
									'CONNECT': false,
									'SPEAK': false,
									'VIEW_CHANNEL': false,
								});

								voicechannel.overwritePermissions(x, {
									'CONNECT': true,
									'SPEAK': true,
									'VIEW_CHANNEL': true,
								});

								textchannel.overwritePermissions(
									client.guilds
										.first()
										.roles.array()
										.find(y => y.name == "@everyone"),
									{
										'SEND_MESSAGES': false,
										'VIEW_CHANNEL': false,
										'READ_MESSAGES': false,
										'READ_MESSAGE_HISTORY': false,
										'EMBED_LINKS': false,
										'ATTACH_FILES': false,
									}
								)

								textchannel.overwritePermissions(x, {
									'SEND_MESSAGES': true,
									'VIEW_CHANNEL': true,
									'READ_MESSAGES': true,
									'READ_MESSAGE_HISTORY': true,
									'EMBED_LINKS': true,
									'ATTACH_FILES': true,
								})

								client.guilds
									.first()
									.member(member.id)
									.addRole(x)
								message.member.addRole(x);

								textchannel.send(
									"Dear <@" +
									member.id +
									"> ,\nyou now have a tryouter that helps you.\nAll messages that are sent in this channel, will be treated with discretion"
								);

								message.guild
									.member(member.id)
									.send(
										"Hi <@" +
										message.author.id +
										"> has accepted your tryout ticket!\n<#" +
										textchannel.id +
										"> is your tryout Chat and <#" + voicechannel.id + "> is the Voice Channel"
									);
							});
					});
				});



			config.tryout.splice(config.tryout.indexOf(member.id), 1);

			setTimeout(() => {
				message.delete();
			}, 3000);

			break;
	}
};

module.exports.help = {
	name: "tryout",
	description: "Manage tryout",
	help: "``tryout\ntryout [user]\ntryout close``"
};
