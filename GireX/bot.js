global.Discord = require("discord.js");

global.client = new Discord.Client();
global.fs = require("fs");
global.jsonfile = require("jsonfile");

global.spam = require(__dirname + "/commands/extra/spam.js");
global.config = require(__dirname + "/config.json");
client.commands = new Discord.Collection();

var defaultPrefix = "!";

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
		spam.init();

		setInterval(() => {
			updateConfig();
		}, 1000 * 60 * 5);

		client.user.setActivity("Entwickler Flam3rboy#5979", {
			type: "PLAYING",
		});

		client.on("message", (message) => {
			if (message.author.id != "564432377175212052") {
				if (message.channel.type == "dm") {
					var t = config.bewerbungen.find((x) => x.user == message.author.id);

					if (t != undefined) {
						if (message.content == "%cancel") {
							message.author
								.send({
									embed: {
										author: {
											name: client.user.username,
											icon_url: client.user.avatarURL,
										},
										title: "Bewerben",
										description: "Bewerbung wurde abgebrochen",
									},
								})
								.catch((e) => {
									message.channel.send({
										embed: {
											author: {
												name: client.user.username,
												icon_url: client.user.avatarURL,
											},
											color: 0xff0000,
											title: "Fehler",
											description: e.message,
										},
									});
								});
							config.bewerbungen.splice(
								config.bewerbungen.findIndex((x) => x.user == message.author.id),
								1
							);
						} else {
							t.fragen.array[t.frage].antwort = message.content;
							t.frage++;

							if (t.frage == t.fragen.array.length) {
								var fields = [];

								config.bewerbungen
									.find((x) => x.user == message.author.id)
									.fragen.array.forEach((x) => {
										fields.push({
											name: x.frage,
											value: x.antwort,
										});
									});

								try {
									client.guilds
										.first()
										.members.find((x) => x.user.id == message.author.id)
										.addRole("564424419070574594");
								} catch (e) {}

								message.channel
									.send({
										embed: {
											author: {
												name: client.user.username,
												icon_url: client.user.avatarURL,
											},
											title: "Bewerbung abgeschlossen",
											fields: fields,
										},
									})
									.catch((e) => {
										message.channel.send({
											embed: {
												author: {
													name: client.user.username,
													icon_url: client.user.avatarURL,
												},
												color: 0xff0000,
												title: "Fehler",
												description: e.message,
											},
										});
									});

								client.guilds
									.first()
									.channels.get("553623631662546944")
									.send({
										embed: {
											author: {
												name: client.user.username,
												icon_url: client.user.avatarURL,
											},
											title: "Bewerbungen",
											description: "Bewerber: <@" + t.user + ">",
											fields: fields,
										},
									})
									.catch((e) => {
										message.channel.send({
											embed: {
												author: {
													name: client.user.username,
													icon_url: client.user.avatarURL,
												},
												color: 0xff0000,
												title: "Fehler",
												description: e.message,
											},
										});
									});

								config.bewerbungen.splice(
									config.bewerbungen.findIndex((x) => x.user == message.author.id),
									1
								);
							} else {
								message.author
									.send({
										embed: {
											author: {
												name: client.user.username,
												icon_url: client.user.avatarURL,
											},
											title: "Bewerben",
											description: t.fragen.array[t.frage].frage,
										},
									})
									.catch((e) => {
										message.channel.send({
											embed: {
												author: {
													name: client.user.username,
													icon_url: client.user.avatarURL,
												},
												color: 0xff0000,
												title: "Fehler",
												description: e.message,
											},
										});
									});
							}
						}
					} else {
						message.author
							.send({
								embed: {
									author: {
										name: client.user.username,
										icon_url: client.user.avatarURL,
									},
									title: "Bewerben",
									description:
										"Du hast momentan keine Bewerbung!\nUm eine neue zu starten schreibe ``%apply`` in <#561567056399695873> rein.",
								},
							})
							.catch((e) => {
								message.channel.send({
									embed: {
										author: {
											name: client.user.username,
											icon_url: client.user.avatarURL,
										},
										color: 0xff0000,
										title: "Fehler",
										description: e.message,
									},
								});
							});
					}
				} else if (spam.check(message) == false) {
					var messageArray = message.content.split(" ");
					var cmd = messageArray[0];
					var args = messageArray.slice(1);
					var prefix = "%";

					if (cmd.slice(0, prefix.length) == prefix) {
						cmd = cmd.slice(prefix.length).toLowerCase();

						if (client.commands.get(cmd) != undefined) {
							client.commands.get(cmd).run(message, args);
						}
					}
				}
			}
		});
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}
