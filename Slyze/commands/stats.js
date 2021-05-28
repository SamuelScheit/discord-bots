module.exports.run = async function(message, args, conf) {
	con.query(
		"SELECT points FROM rotation WHERE clan_id = 1 AND discord_id = '" +
			message.author.id +
			"'",
		function(err, result, fields) {
			var author = result;

			if (author[0] == undefined) {
				author[0] = {
					points: "0"
				};
			}

			con.query(
				"SELECT * FROM rotation WHERE clan_id = 1 ORDER BY points DESC LIMIT 10",
				function(err, result, fields) {
					if (err) throw err;
					var text = "";

					result.forEach((x, i) => {
						text +=
							"__**" +
							(i + 1) +
							"**__:   " +
							x.points +
							"	**<@" +
							x.discord_id +
							">**\n";
					});

					message.channel.send({
						embed: {
							author: {
								name: message.author.username,
								icon_url: message.author.avatarURL
							},
							title: "Du hast " + author[0].points + " Punkte",
							color: 0x22ff22
						}
					});

					message.channel.send({
						embed: {
							title: "LEADERBOARD ROTATION GAMES",
							description: text,
							color: 0x22ff22
						}
					});
				}
			);
		}
	);
};

module.exports.help = {
	name: "help",
	description: "Display all Commands",
	help: "``help [command]``"
};
