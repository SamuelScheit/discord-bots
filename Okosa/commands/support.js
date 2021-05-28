global.config.tickets = [];

module.exports.run = function(message, args) {
	if (message.channel.type == "dm")
		return message.channel
			.send({
				embed: {
					color: 0xff0000,
					title: "Partner: Fehler",
					thumbnail: {
						url: client.user.avatarURL
					},
					description:
						"Du kannst diesen Befehl nur auf dem Server ausführen!"
				}
			})
			.then(x => setTimeout(() => x.delete(), 3000));

	if (args[0] == undefined) {
		if (config.tickets.find(x => x.user == message.author.id)) {
			message.channel
				.send({
					embed: {
						color: 0xff0000,
						title: "Support: Fehler",
						thumbnail: {
							url: client.user.avatarURL
						},
						description: "Du hast bereits ein Support Ticket!"
					}
				})
				.catch(e => {});
		} else {
			var supporter = "";
			if (message.guild.id == "530064694560555008") {
				supporter = "<@&539419982090469407><@&530404628316160000>";
			} else {
				supporter = "<@&562347970209775646><@&562349053300703232>";
			}

			message.channel
				.send({
					embed: {
						color: 0xff0000,
						title: "Support",
						thumbnail: {
							url: client.user.avatarURL
						},
						description:
							"Der Nutzer <@" +
							message.author.id +
							"> braucht Hilfe.\n" +
							supporter +
							" benutze \n``!support @" +
							message.author.tag +
							"``\num den Chat mit ihm zu starten."
					}
				})
				.catch(e => {});
			message.channel
				.send({
					embed: {
						color: 0x00ff00,
						title: "Support",
						thumbnail: {
							url: client.user.avatarURL
						},
						description:
							"Deine Support-Anfrage wurde übermittelt.\nDu erhählst eine Privatnachricht, sobald deine Anfrage bearbeitet wird."
					}
				})
				.catch(e => {});
			config.tickets.push({ user: message.author.id });
		}
	} else {
		var t = message.guild.members.find(x => x.id == message.author.id);
		if (t.hasPermission(8192) || true) {
			var u;

			if (t == undefined) {
				message.channel
					.send({
						embed: {
							color: 0xff0000,
							title: "Support: Fehler",
							thumbnail: {
								url: client.user.avatarURL
							},
							description:
								"Du musst dich auf dem Discord Server befinden!"
						}
					})
					.catch(e => {});
			} else {
				if (config.tickets.find(x => x.supporter == t.user.id)) {
					message.channel
						.send({
							embed: {
								color: 0xff0000,
								title: "Support: Fehler",
								thumbnail: {
									url: client.user.avatarURL
								},
								description:
									"Du beantwortest bereits ein Supportticket!\nStoppe den Support mit ``!endsupport``, um ein neues zu bearbeiten"
							}
						})
						.catch(e => {});
				} else {
					if (args[0].startsWith("<")) {
						if (message.mentions.users.size > 0) {
							u = message.guild.members.find(
								x =>
									x.user.id ==
									message.mentions.users.first().id
							).id;
						} else {
							u = args[0].replace("<@", "").replace(">", "");
						}
					} else if (args[0].startsWith("@")) {
						u = args[0].replace("@", "");
						u = message.guild.members.find(x => x.user.tag == u).id;
					}

					if (u == undefined) {
						message.channel
							.send({
								embed: {
									color: 0xff0000,
									title: "Support: Fehler",
									thumbnail: {
										url: client.user.avatarURL
									},
									description: "Nutzer nicht gefunden!"
								}
							})
							.catch(e => {});
					} else {
						if (
							config.tickets.find(x => x.user == u) == undefined
						) {
							message.channel
								.send({
									embed: {
										color: 0xff0000,
										title: "Support: Fehler",
										thumbnail: {
											url: client.user.avatarURL
										},
										description:
											"<@" +
											u +
											"> hat kein Support Ticket angefragt!"
									}
								})
								.catch(e => {});
						} else {
							if (
								config.tickets.find(x => x.user == u)
									.supporter != undefined
							) {
								message.channel
									.send({
										embed: {
											color: 0xff0000,
											title: "Support: Fehler",
											thumbnail: {
												url: client.user.avatarURL
											},
											description:
												"Dieses Support Ticket wird schon beantwortet!"
										}
									})
									.catch(e => {});
							} else {
								config.tickets.find(
									x => x.user == u
								).supporter = message.author.id;

								message.guild.members
									.find(
										x =>
											x.user.id ==
											config.tickets.find(
												x => x.user == u
											).user
									)
									.send({
										embed: {
											color: 0x00ff00,
											title: "Support",
											thumbnail: {
												url: client.user.avatarURL
											},
											description:
												"Deine Support-Anfrage wird nun von <@" +
												message.author.id +
												"> bearbeitet. Jede Nachricht, die während des Support-Prozesses in diesem Chat geschrieben wird, wird an den anderen Chat-Partner übermittelt."
										}
									})
									.catch(e => {});

								message.author
									.send({
										embed: {
											color: 0x00ff00,
											title: "Support",
											thumbnail: {
												url: client.user.avatarURL
											},
											description:
												"Deine Support-Anfrage wird nun von <@" +
												message.author.id +
												"> bearbeitet. Jede Nachricht, die während des Support-Prozesses in diesem Chat geschrieben wird, wird an den anderen Chat-Partner übermittelt. Um den Support zu beenden, benutze ``!endsupport`` in dem Privatchat."
										}
									})
									.catch(e => {});
							}
						}
					}
				}
			}
		} else {
			message.channel
				.send({
					embed: {
						color: 0xff0000,
						title: "Support: Fehler",
						thumbnail: {
							url: client.user.avatarURL
						},
						description:
							"Du hast nicht die benötigten Berechtigung!"
					}
				})
				.catch(e => {});
		}
	}
};

module.exports.help = {
	name: "support",
	description: "Manage Support",
	help: "``support\nsupport [user]``"
};
