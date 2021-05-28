var Discord = require("discord.js");
global.client = new Discord.Client();
var JSON = require("circular-json");
var mysql = require("mysql");

global.con = mysql.createConnection({
	host: "server",
	user: "clan",
	password: "REDACTED",
	database: "clan",
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Database Connected!");
});

global.clans;

con.query("SELECT * FROM clans", (err, result, fields) => {
	clans = result;
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.on("message", (message) => {
		try {
			if (message.author.id != "554703603550388244") {
				var msg = message.content.split(" ");

				switch (msg[0]) {
					case "!help":
						message.channel.send(
							"Mögliche Befehle sind:\n```!leaderboard``` oder ```!stats``` oder ```!rank``` oder ```!fm``` um die Rotation Games stats anzuzeigen"
						);
						break;
					case "%apply":
					case "!website":
					case "!bewerben":
						message.channel.send(
							"Das ist unsere offizielle Clan Website: " +
								clans.find((x) => x.server == message.guild.id).website +
								"\nDort kannst du dich auch bewerben!"
						);
						break;
					case "!stats":
					case "!rank":
					case "!fm":
					case "!leaderboard":
						con.query(
							"SELECT points FROM rotation WHERE clan_id = " +
								clans.find((x) => x.server == message.guild.id).id +
								" AND discord_id = '" +
								message.author.id +
								"'",
							function (err, result, fields) {
								var author = result;

								if (author[0] == undefined) {
									author[0] = {
										points: "0",
									};
								}

								con.query(
									"SELECT * FROM rotation WHERE clan_id = " +
										clans.find((x) => x.server == message.guild.id).id +
										" ORDER BY points DESC LIMIT 10",
									function (err, result, fields) {
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
													icon_url: message.author.avatarURL,
												},
												title: "Du hast " + author[0].points + " Punkte",
												color: 0x22ff22,
											},
										});

										message.channel.send({
											embed: {
												title: "LEADERBOARD ROTATION GAMES",
												description: text,
												color: 0x22ff22,
											},
										});
									}
								);
							}
						);
						break;
				}
			}
		} catch (e) {
			message.channel.send("Fehler: " + e);
			console.log(e);
		}
	});
});

client.login(process.env.TOKEN);
