module.exports.run = function(message, conf, finish) {
	chooseNotify(message, conf, finish);
};

function chooseNotify(message, conf, finish) {
	var text = "You selected:\n";

	var roles = data[conf].notify.roles;

	if (roles.length > 0) {
		text += "Roles:\n";
		roles.forEach(x => {
			text += "<@&" + x + ">\n";
		});
	}

	var members = data[conf].notify.users;

	if (members.length > 0) {
		text += "Members:\n";
		members.forEach(x => {
			text += "<@" + x + ">\n";
		});
	}

	message.clearReactions().then(() => {
		message
			.edit({
				embed: {
					color: config.colors.blue,
					author: {
						name:
							ln[data[conf].ln].commands.setup.chooseNotify + "!"
					},
					title:
						"\n:one:  " +
						ln[data[conf].ln].Interface.role +
						"\n:two:  " +
						ln[data[conf].ln].Interface.member,
					description: text
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

				await m.react("🚪");
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
						case reaction_numbers[1]: //Rolle
							chooseNotifyRole(message, conf, finish);
							break;
						case reaction_numbers[2]: //Nutzer
							chooseNotifyPerson(message, conf, finish);
							break;
						case "🚪":
							finish();
							return;
							break;
					}

					console.log(reaction);
				});
			});
	});
}

function chooseNotifyPerson(message, conf, finish) {
	var members = message.guild.members.array().sort(sort.member);
	var text = "";
	var start = 0;
	var end = 9;
	var selectedMembers = members.slice(start, end);

	data[conf].notify.users.forEach(x => {
		if (members.find(y => y.user.id == x)) {
			members.find(y => y.user.id == x).selected = true;
		}
	});

	text = memberText(selectedMembers);

	message
		.edit({
			embed: {
				color: config.colors.blue,
				author: {
					name: "chooseNotifyPerson!"
				},
				description: text
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

			for (var i = 3; i <= selectedMembers.length; i++) {
				await m.react(reaction_numbers[i]);
			}

			if (members.length > 9) {
				await m.react("⬅");
				await m.react("➡");
			}

			var collector = m.createReactionCollector((reaction, user) => {
				if (user.id != client.user.id) {
					reaction.remove(user);
				}
				return user.id != client.user.id;
			}, {});

			collector.on("collect", (reaction, ReactionCollector) => {
				var n = parseInt(getNumberFromEmoji(reaction.emoji.name));
				if (n != undefined && isNaN(n) == false) {
					if (members[start + n - 1].selected == true) {
						data[conf].notify.users = data[
							conf
						].notify.users.filter(
							x => x != members[start + n - 1].user.id
						);
						members[start + n - 1].selected = false;
						selectedMembers[n - 1].selected = false;
					} else {
						data[conf].notify.users.push(
							members[start + n - 1].user.id
						);
						members[start + n - 1].selected = true;
						selectedMembers[n - 1].selected = true;
					}

					text = memberText(selectedMembers);

					message.edit({
						embed: {
							color: config.colors.blue,
							author: {
								name: "chooseNotifyRole!"
							},
							description: text
						}
					});
				}

				switch (reaction.emoji.name) {
					case "⬅":
						text = "";
						start -= 9;
						end -= 9;
						if (start <= 0) {
							start = 0;
							end = 9;
						}
						selectedMembers = members.slice(start, end);
						text = memberText(
							selectedMembers,
							data[conf].notify.users
						);

						message.edit({
							embed: {
								color: config.colors.blue,
								author: {
									name: "chooseNotifyRole!"
								},
								description: text
							}
						});
						break;
					case "🚪":
						collector.filter = () => {
							return false;
						};

						chooseNotify(message, conf, finish);
						break;
					case "➡":
						text = "";
						start += 9;
						end += 9;
						if (start > members.length) {
							start -= 9;
							end -= 9;
						}

						selectedMembers = members.slice(start, end);

						text = memberText(
							selectedMembers,
							data[conf].notify.users
						);

						message.edit({
							embed: {
								color: config.colors.blue,
								author: {
									name: "chooseNotifyRole!"
								},
								description: text
							}
						});
						break;
				}
				parseInt(getNumberFromEmoji(reaction.emoji.name));

				console.log(reaction);
			});
		});
}

function chooseNotifyRole(message, conf, finish) {
	var roles = message.guild.roles.array().sort(sort.position);
	var text = "";
	var start = 0;
	var end = 9;
	var selectedRole = roles.slice(start, end);

	text = roleText(selectedRole);

	data[conf].notify.roles.forEach(x => {
		if (roles.find(y => y.id == x) != undefined) {
			roles.find(y => y.id == x).selected = true;
		}
	});

	message
		.edit({
			embed: {
				color: config.colors.blue,
				author: {
					name: "chooseNotifyRole!"
				},
				description: text
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

			for (var i = 3; i <= selectedRole.length; i++) {
				await m.react(reaction_numbers[i]);
			}

			if (roles.length > 9) {
				await m.react("⬅");
				await m.react("➡");
			}

			var collector = m.createReactionCollector((reaction, user) => {
				if (user.id != client.user.id) {
					reaction.remove(user);
				}
				return user.id != client.user.id;
			}, {});

			collector.on("collect", (reaction, ReactionCollector) => {
				var n = parseInt(getNumberFromEmoji(reaction.emoji.name));
				if (n != undefined && isNaN(n) == false) {
					if (roles[start + n - 1].selected == true) {
						data[conf].notify.roles = data[
							conf
						].notify.roles.filter(
							x => x != roles[start + n - 1].id
						);
						roles[start + n - 1].selected = false;
						selectedRole[n - 1].selected = false;
					} else {
						data[conf].notify.roles.push(roles[start + n - 1].id);

						roles[start + n - 1].selected = true;
						selectedRole[n - 1].selected = true;
					}

					updateData();

					text = roleText(selectedRole);

					message.edit({
						embed: {
							color: config.colors.blue,
							author: {
								name: "chooseNotifyRole!"
							},
							description: text
						}
					});
				}

				switch (reaction.emoji.name) {
					case "⬅":
						text = "";
						start -= 9;
						end -= 9;
						if (start <= 0) {
							start = 0;
							end = 9;
						}
						selectedRole = roles.slice(start, end);
						text = roleText(selectedRole);

						message.edit({
							embed: {
								color: config.colors.blue,
								author: {
									name: "chooseNotifyRole!"
								},
								description: text
							}
						});
						break;
					case "🚪":
						collector.filter = () => {
							return false;
						};

						chooseNotify(message, conf, finish);
						break;
					case "➡":
						text = "";
						start += 9;
						end += 9;
						if (start > roles.length) {
							start -= 9;
							end -= 9;
						}

						selectedRole = roles.slice(start, end);

						text = roleText(selectedRole);

						message.edit({
							embed: {
								color: config.colors.blue,
								author: {
									name: "chooseNotifyRole!"
								},
								description: text
							}
						});
						break;
				}
				parseInt(getNumberFromEmoji(reaction.emoji.name));

				console.log(reaction);
			});
		});
}

function roleText(r) {
	var text = "";
	r.forEach((e, i) => {
		if (e.selected == true) {
			text +=
				"__***" +
				getEmojiFromNumber((i + 1).toString()) +
				": <@&" +
				e.id +
				">***__\n";
		} else {
			text +=
				getEmojiFromNumber((i + 1).toString()) + ": <@&" + e.id + ">\n";
		}
	});
	return text;
}

function memberText(r) {
	var text = "";
	r.forEach((e, i) => {
		if (e.selected == true) {
			text +=
				"__***" +
				getEmojiFromNumber((i + 1).toString()) +
				": <@" +
				e.user.id +
				">***__\n";
		} else {
			text +=
				getEmojiFromNumber((i + 1).toString()) +
				": <@" +
				e.user.id +
				">\n";
		}
	});
	return text;
}
