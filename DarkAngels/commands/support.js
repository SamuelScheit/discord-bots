module.exports.run = function(message, args) {
	if (message.channel.type == "dm")
		return message.channel
			.send({
				embed: {
					color: 0x808080,
					title: "Fehler",
					thumbnail: {
						url: client.user.avatarURL
					},
					description:
						"Du kannst diesen Befehl nur auf dem Server ausführen!"
				}
			})
			.then(x => setTimeout(() => x.delete(), 3000));

	switch (args[0]) {
		case undefined: //!support
			var ticket = config.support.find(x => x == message.author.id);

			if (ticket)
				return message.channel
					.send({
						embed: {
							color: 0x808080,
							title: "Fehler",
							description: "Du hast bereits ein Support Ticket!"
						}
					})
					.then(x => setTimeout(() => x.delete(), 3000));

			message.channel.send({
				embed: {
					color: 0x808080,
					title: "Supportanfrage gestellt",
					description:
						message.author.username +
						" habe ein wenig Geduld.\nDer nächste Moderator :zap: wird sich um dich kümmern."
				}
			});

			message.guild.roles
				.filter(
					x =>
						x.id == "568540078343716888" ||
						x.id == "511915434157670429"
				)
				.forEach(r => {
					r.members.forEach(function(user) {
						user.send({
							embed: {
								color: 0x808080,
								title: "Support Anfrage",
								description:
									"Der User " +
									message.author.username +
									" benötigt Support.\nDu kannst das Ticket mit !support @" +
									message.author.username +
									" in <#568116400863051776> öffnen."
							}
						});
					});
				});

			setTimeout(() => {
				message.delete();
			}, 3000);

			config.support.push(message.author.id);
			break;
		case "close":
			if (message.channel.name.toLowerCase().indexOf("╠support-") == -1)
				return false;

			message.channel.send({
				embed: {
					color: 0x808080,
					title: "Support Geschlossen",
					description:
						"Das Support Ticket wurde von <@" +
						message.author.id +
						"> geschlossen"
				}
			});

			message.guild.roles
				.find(x => x.name == message.channel.name)
				.delete();

			setTimeout(() => {
				message.channel.delete();
				message.delete();
			}, 5000);

			break;
		default:
			//accept support
			if (
				message.member.hasPermission(32) ||
				message.member.roles.find(x => x.id == "568540078343716888")
			) {
				var member = message.mentions.users.first();

				message.guild.channels
					.find(x => x.id == "568116400863051776")
					.fetchMessages({ limit: 100 })
					.then(messages => {
						!messages.forEach(msg => {
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
							title:
								this.help.name +
								": Hilfe/Nutzer nicht gefunden",
							description: this.help.help
						}
					});

				var ticket = config.support.find(x => x == member.id);

				if (ticket == undefined)
					return message.channel.send({
						embed: {
							color: 0x808080,
							description:
								"<@" +
								member.id +
								"> hat kein Support Ticket angefragt!"
						}
					});

				message.guild
					.createChannel("╠support-" + member.id, "text")
					.then(channel => {
						channel.setParent("568116123963490331");
						message.guild
							.createRole({ name: channel.name })
							.then(x => {
								channel.overwritePermissions(
									client.guilds
										.first()
										.roles.array()
										.find(y => y.name == "@everyone"),
									{
										VIEW_CHANNEL: false,
										SEND_MESSAGES: false
									}
								);

								channel.overwritePermissions(x, {
									SEND_MESSAGES: true,
									VIEW_CHANNEL: true
								});

								client.guilds
									.first()
									.member(member.id)
									.addRole(x);
								message.member.addRole(x);
							});

						channel.send({
							embed: {
								color: 0x808080,
								title: "Support",
								description:
									"Lieber <@" +
									member.id +
									"> ,\ndir steht nun ein Moderator zur Seite.\nBitte verhalte dich in diesem Channel,\nwie es hier auf dem Discord gewünscht ist."
							}
						});

						message.guild.member(member.id).send({
							embed: {
								color: 0x808080,
								title: "Support Angenommen",
								description:
									"Hey <@" +
									message.author.id +
									"> hat dein Support Ticket angenommen!\n<#" +
									channel.id +
									"> ist der Support Chat"
							}
						});
					});

				config.support.splice(config.support.indexOf(member.id), 1);
			}

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
