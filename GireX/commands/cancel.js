module.exports.run = function(message, args) {
	if (config.bewerbungen.find(x => x.user == message.author.id)) {
		config.bewerbungen.splice(
			config.bewerbungen.findIndex(x => x.user == message.author.id),
			1
		);

		message.channel
			.send({
				embed: {
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Bewerben",
					description: "Bewerbung wurde abgebrochen"
				}
			})
			.catch(e => {
				message.channel.send({
					embed: {
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						color: 0xff0000,
						title: "Fehler",
						description: e.message
					}
				});
			});
	} else {
		message.channel
			.send(
				"Du hast momentan keine Bewerbung!\nUm eine neue zu starten schreibe ``%apply`` in <#561567056399695873> rein."
			)
			.catch(e => {
				message.channel.send({
					embed: {
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL
						},
						color: 0xff0000,
						title: "Fehler",
						description: e.message
					}
				});
			});
	}
};

module.exports.help = {
	name: "cancel"
};
