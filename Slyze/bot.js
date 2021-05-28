global.Discord = require("discord.js");
var mysql = require("mysql");
global.client = new Discord.Client();
global.fs = require("fs");
global.jsonfile = require("jsonfile");

global.channelCreation = require(__dirname + "/commands/extra/channelCreation.js");
global.config = require(__dirname + "/config.json");

client.commands = new Discord.Collection();

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

var prefix = "!";

function updateMessage(message) {
	con.query("SELECT * FROM rotation WHERE clan_id = 1 ORDER BY points DESC", function (err, result, fields) {
		if (err) throw err;
		var text = "";

		result.forEach((x, i) => {
			try {
				text +=
					i +
					1 +
					": " +
					x.points +
					" - ``" +
					server.members.find((y) => y.user.id == x.discord_id).user.username +
					"``\n";
			} catch (e) {}
		});

		message.edit({
			embed: {
				title: "LEADERBOARD ROTATION GAMES",
				description: text,
				color: 0x22ff22,
			},
		});
	});
}

fs.readdir(__dirname + "/commands/", {}, (err, file) => {
	if (err) console.error(err);

	var jsfile = file.filter((f) => f.split(".").pop() === "js");

	if (jsfile.length <= 0) console.log("Couldn't find any commands");

	jsfile.forEach((f, i) => {
		let props = require(__dirname + "/commands/" + f);
		console.log(f + " loaded!");
		client.commands.set(props.help.name, props);
	});
});

global.updateConfig = function () {
	jsonfile
		.writeFile(__dirname + "/config.json", config)
		.then((res) => {
			console.log("Saved config");
		})
		.catch((error) => console.error(error));
};

try {
	client.on("ready", () => {
		try {
			setInterval(() => {
				updateConfig();
			}, 1000 * 60 * 5);
			console.log(`Logged in as ${client.user.tag}!`);

			client.user.setActivity(" auf !help", {
				type: "LISTENING",
			});

			channelCreation.init();

			global.server = client.guilds.array().find((x) => x.id == "554697012373749770");

			server.channels
				.get("560177869997998111")
				.fetchMessage("560178440242987018")
				.then((x) => {
					updateMessage(x);
					console.log(x.content);
				});

			client.on("messageReactionAdd", function (reaction, user) {
				if (reaction.message.id == "560178440242987018") {
					updateMessage(reaction.message);
				}
			});

			setInterval(() => {
				updateMessage(server.channels.get("560177869997998111").messages.first());
			}, 1000 * 60 * 60 * 24); //jeden Tag

			client.on("message", (message) => {
				if (message.author.id != "554703603550388244") {
					if (message.channel.type == "dm") {
					} else {
						var messageArray = message.content.split(" ");
						var cmd = messageArray[0];
						var args = messageArray.slice(1);

						if (cmd.slice(0, prefix.length) == prefix) {
							cmd = cmd.slice(prefix.length).toLowerCase();

							if (client.commands.get(cmd) != undefined) {
								client.commands.get(cmd).run(message, args);
							}
						}
					}
				}
			});

			client.on("voiceStateUpdate", (oldMember, newMember) => {
				try {
					let newUserChannel = newMember.voiceChannel;
					let oldUserChannel = oldMember.voiceChannel;
					if (
						oldUserChannel == undefined ||
						(newUserChannel !== undefined && newUserChannel.id != oldUserChannel.id)
					) {
						switch (newUserChannel.id) {
							case "557577518417444879":
								var moderators = server.members.filter(
									(x) =>
										x.highestRole.id == "554698446326595607" ||
										x.highestRole.id == "554698993184014340" ||
										x.highestRole.id == "554698994388041779" ||
										x.highestRole.id == "554698993951571968" ||
										x.highestRole.id == "565238521128943618" ||
										x.highestRole.id == "557278535031586816"
								);

								moderators.forEach((x) => {
									console.log(x.username);
									x.user.send(
										"Hey <@" +
											newMember.user.id +
											">#" +
											newMember.user.discriminator +
											" ist in <#" +
											newUserChannel.id +
											"> gejoint"
									);
								});
								break;
							case "554732784791322674": //warten auf support
								var moderators = server.members.filter(
									(x) =>
										x.highestRole.id == "554698446326595607" ||
										x.highestRole.id == "554698993184014340" ||
										x.highestRole.id == "565238521128943618" ||
										x.highestRole.id == "554698994388041779" ||
										x.highestRole.id == "554698993951571968"
								);

								moderators.forEach((x) => {
									console.log(x.user.username);
									x.send(
										"Hey <@" +
											newMember.user.id +
											">#" +
											newMember.user.discriminator +
											" ist in <#" +
											newUserChannel.id +
											"> gejoint"
									).catch((e) => console.error(e));
								});

								break;
							default:
								break;
						}
					} else if (newUserChannel === undefined) {
					}
				} catch (e) {}
			});
		} catch (e) {}
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}
