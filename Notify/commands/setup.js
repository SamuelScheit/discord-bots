var chooseNotify = require(__dirname + "/extra/chooseNotify");

function chooseLanguage(message, conf, finish) {
	message.channel
		.send({
			embed: {
				color: config.colors.blue,
				author: {
					name: ln[data[conf].ln].commands.setup.chooseLanguage + "!"
				}
			}
		})
		.then(async function(m) {
			var counter = 0;
			Object.keys(ln).forEach(async function(i) {
				await m.react(ln[i].language[i].flag).then(() => {
					counter++;
					continu(m);
				});
			});

			function continu(m) {
				if (counter >= Object.keys(ln).length) {
					var collector = m.createReactionCollector(
						(reaction, user) => {
							if (user.id != client.user.id) {
								reaction.remove(user);
							}
							return user.id != client.user.id;
						},
						{}
					);

					collector.on("collect", (reaction, ReactionCollector) => {
						collector.filter = function() {
							return false;
						};

						var index = data.findIndex(
							x => x.serverId == reaction.message.guild.id
						);
						var language = "";

						Object.keys(ln).forEach(function(i) {
							if (
								ln[i].thisLanguage.flag == reaction.emoji.name
							) {
								data[index].ln = ln[i].thisLanguage.short;
								language = ln[i].thisLanguage.name;
							}
						});

						updateData();
						reaction.message.clearReactions().then(() => {
							reaction.message
								.edit({
									embed: {
										color: config.colors.green,
										author: {
											name:
												ln[data[conf].ln].commands.setup
													.successChangeLanguage +
												language
										}
									}
								})
								.then(() => {
									finish(reaction.message);
								});
						});
					});
				}
			}
		})
		.catch(e => {
			console.error(e);
		});
}

function choosePrefix(message, conf, finish) {
	message
		.edit({
			embed: {
				color: config.colors.blue,
				author: {
					name: ln[data[conf].ln].commands.setup.chooseNotify + "!"
				},
				title:
					"\n:one:  " +
					ln[data[conf].ln].Interface.role +
					"\n:two:  " +
					ln[data[conf].ln].Interface.member
			}
		})
		.then(async function(m) {
			var reaction_numbers = [
				"\u0030\u20E3",
				"\u0031\u20E3",
				"\u0032\u20E3",
				"\u0033\u20E3",
				"\u0034\u20E3",
				"\u0035\u20E3",
				"\u0036\u20E3",
				"\u0037\u20E3",
				"\u0038\u20E3",
				"\u0039\u20E3"
			];

			await m.react(reaction_numbers[1]);
			await m.react(reaction_numbers[2]);

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
					case "1⃣": //Rolle
						chooseNotifyRole(message, conf, finish);
						break;
					case "2️⃣": //Nutzer
						chooseNotifyPerson(message, conf, finish);
						break;
				}

				console.log(reaction);
			});
		});
}

module.exports.run = async function(message, args, conf) {
	if (message.member.hasPermission(8192)) {
		message.delete();
		chooseLanguage(message, conf, msg => {
			setTimeout(() => {
				chooseNotify.run(msg, conf, () => {
					console.log("finish notify");
					msg.delete();
				});
			}, 0);
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
	name: "setup",
	help: "``setup``"
};
