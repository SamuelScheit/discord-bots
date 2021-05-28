module.exports.run = function(message, args) {
	var t = config.tickets.find(x => x.supporter == message.author.id);

	if (t == undefined) {
		message.channel.send({
			embed: {
				color: 0xff0000,
				title: "Support: Fehler",
				thumbnail: {
					url: client.user.avatarURL
				},
				description: "Nur Supporter können den Support beenden"
			}
		});
	} else {
		var s;
		var u;
		client.guilds.forEach(y => {
			var x = y.member(t.supporter);
			if (x != undefined) {
				s = x;
			}
			var z = y.member(t.user);
			if (z != undefined) {
				u = z;
			}
		});

		if (s != undefined) {
			s.send({
				embed: {
					color: 0x00ff00,
					title: "Support",
					thumbnail: {
						url: client.user.avatarURL
					},
					description:
						"Der Support-Chat wurde von <@" +
						message.author.id +
						"> beendet."
				}
			}).catch(e => {});
		}

		u.send({
			embed: {
				color: 0x00ff00,
				title: "Support",
				thumbnail: {
					url: client.user.avatarURL
				},
				description:
					"Der Support-Chat wurde von <@" +
					message.author.id +
					"> beendet."
			}
		}).catch(e => {});

		config.tickets.splice(
			config.tickets.findIndex(
				x =>
					x.user == message.author.id ||
					x.supporter == message.author.id
			),
			1
		);
	}
};

module.exports.help = {
	name: "endsupport",
	description: "Endsupport",
	help: "``endsupport``"
};
