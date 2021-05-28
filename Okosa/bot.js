global.Discord = require("discord.js");

global.client = new Discord.Client();
global.fs = require("fs");
global.jsonfile = require("jsonfile");

global.channelCreation = require(__dirname + "/commands/extra/channelCreation.js");
global.userAnalyse = require(__dirname + "/commands/extra/userAnalyse.js");
global.spam = require(__dirname + "/commands/extra/spam.js");
global.config = require(__dirname + "/config.json");
client.commands = new Discord.Collection();

global.prefix = "!";

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
		console.log(`Logged in as ${client.user.tag}!`);
		client.channels.forEach((channel) => {
			if (channel.type == "dm" || channel.type == "text") {
				channel.fetchMessages({ limit: 100 }).catch((e) => {});
			}
		});

		setInterval(() => {
			updateConfig();
		}, 1000 * 60 * 5);

		spam.init();
		channelCreation.init();
		userAnalyse.init();
		client.commands.get("partner").init();
		client.commands.get("apply").init();

		setInterval(() => {
			client.user.setActivity("Entwickler Flam3rboy#5979", {
				type: "PLAYING",
			});
		}, 30000);

		setTimeout(() => {
			setInterval(() => {
				client.user.setActivity("Rouve eSport", {
					type: "PLAYING",
				});
			}, 30000);
		}, 10000);

		setTimeout(() => {
			setInterval(() => {
				client.user.setActivity("Code: Baqzzz", {
					type: "PLAYING",
				});
			}, 30000);
		}, 20000);

		client.on("message", (message) => {
			if (message.author.id != client.user.id) {
				if (message.channel.type == "dm") {
					var t = config.bewerbungen.find((x) => x.user == message.author.id);

					if (t != undefined) {
						client.commands.get("apply").dm(message);
					} else {
						var s = config.tickets.find((x) => x.supporter == message.author.id);
						var u = config.tickets.find((x) => x.user == message.author.id);

						if (u != undefined) {
							s = u.supporter;
							client.guilds.forEach((y) => {
								var t = y.member(s);
								if (t != undefined) {
									s = t;
								}
							});

							if (s != undefined) {
								s.send({
									embed: {
										color: 0xffffff,
										author: {
											name: message.author.tag,
											icon_url: message.author.displayAvatarURL,
										},
										description: message.content,
									},
								}).catch((e) => {});
							}
						}
						if (s != undefined) {
							u = s.user;
							u = client.guilds.first().member(u);

							if (u != undefined) {
								u.send({
									embed: {
										color: 0xffffff,
										author: {
											name: message.author.tag,
											icon_url: message.author.displayAvatarURL,
										},
										description: message.content,
									},
								}).catch((e) => {});
							}
						}
					}
				}

				var messageArray = message.content.split(" ");
				var cmd = messageArray[0];
				var args = messageArray.slice(1);

				if (cmd.slice(0, prefix.length) == prefix) {
					cmd = cmd.slice(prefix.length).toLowerCase();

					if (client.commands.get(cmd) != undefined) {
						client.commands.get(cmd).run(message, args);
						console.log(cmd, args);
						if (message.channel.type != "dm") setTimeout((msg) => msg.delete(), 3000, message);
					} else {
						spam.check(message);
					}
				}
			} else {
			}
		});
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}
