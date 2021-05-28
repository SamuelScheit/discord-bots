module.exports.init = () => {
	config.rr.forEach(rr => {
		client.guilds
			.first()
			.channels.find(x => x.id == rr.channel)
			.fetchMessage(rr.msg);
	});

	client.on("messageReactionAdd", (reaction, user) => {
		var c = config.rr.find(
			rr =>
				rr.msg == reaction.message.id && rr.emoji == reaction.emoji.name
		);

		if (c) {
			var u = client.guilds.first().member(user);
			if (u) u.addRole(c.role);
		}
	});

	client.on("messageReactionRemove", (reaction, user) => {
		var c = config.rr.find(
			rr =>
				rr.msg == reaction.message.id && rr.emoji == reaction.emoji.name
		);

		if (c) {
			var u = client.guilds.first().member(user);
			if (u) u.removeRole(c.role);
		}
	});
};

module.exports.run = (msg, args) => {
	switch (args[0]) {
		case "add":
			var c = msg.mentions.channels.first();
			var r = msg.mentions.roles.first();

			if (!r && args[4]) {
				var r = msg.guild.roles.find(
					x =>
						x.name.toLowerCase().indexOf(args[4].toLowerCase()) !=
						-1
				);
			}

			if (!c || !r || !args[1] || !args[2] || !args[3] || !args[4]) {
				return send(
					msg.channel,
					"help",
					"Reaction role",
					this.help.help
				);
			}

			c.fetchMessage(args[2]).then(message => {
				if (args[3].indexOf(":") != -1) {
					var t = msg.content.slice(msg.content.indexOf("<:") + 2);
					args[3] = msg.guild.emojis.get(
						t.slice(t.indexOf(":") + 1, t.indexOf(">"))
					);
					config.rr.push({
						channel: c.id,
						msg: message.id,
						emoji: args[3].name,
						role: r.id
					});
				} else {
					config.rr.push({
						channel: c.id,
						msg: message.id,
						emoji: args[3],
						role: r.id
					});
				}

				message.react(args[3]);
			});
		default:
			send(msg.channel, "help", "Reaction Role", this.help.help);
			break;
	}
};

module.exports.help = {
	name: "rr",
	help: "rr add [channel] [messageid] [reactionemoji] [role]",
	description: "Ads a reaction to a message"
};
