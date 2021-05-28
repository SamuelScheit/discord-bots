global.Discord = require("discord.js");
global.YouTube = require("simple-youtube-api");
global.ytdl = require("ytdl-core");
global.Util = require("discord.js");
global.youtube = new YouTube("REDACTED");
global.client = new Discord.Client();
global.fs = require("fs");
global.jsonfile = require("jsonfile");
global.tmi = require("tmi.js");

global.channelCreation = require(__dirname + "/commands/extra/channelCreation.js");
global.spam = require(__dirname + "/commands/extra/spam.js");
global.userAnalyse = require(__dirname + "/commands/extra/userAnalyse.js");
global.config = require(__dirname + "/config.json");
client.commands = new Discord.Collection();

global.prefix = "!";

global.badwords;

fs.readFile(__dirname + "/badwords.txt", "utf8", function (err, data) {
	if (err) throw err;
	badwords = data.split("\n");
});

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

const opts = {
	identity: {
		username: "flam3rboy3",
		password: "REDACTED",
	},
	channels: ["flam3rboy3"],
	// channels: ["meetrix_", "daderlampe"]
};
global.twitch = new tmi.client(opts);

global.updateConfig = function () {
	jsonfile
		.writeFile(__dirname + "/config.json", config)
		.then((res) => {
			console.log("Saved config");
		})
		.catch((error) => console.error(error));
};

twitch.on("connected", function (addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
});

twitch.on("roomstate", (channel, state) => {
	// console.log(channel, state);
});

twitch.on("join", function (channel, username, self) {
	// console.log("join", channel, username, self);
});

twitch.on("raw_message", (messageCloned, message) => {
	// console.log(message.raw);
});

twitch.connect();

try {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);

		client.user.setActivity("!help");

		client.channels.forEach((channel) => {
			if (channel.type == "voice" || channel.type == "category") return false;

			channel.fetchMessages({ limit: 100 });
		});

		setInterval(() => {
			updateConfig();
		}, 1000 * 60 * 5);

		userAnalyse.init();
		spam.init();
		client.commands.get("apply").init();
		client.commands.get("rr").init();
		client.commands.get("partner").init();
		channelCreation.init();

		client.on("guildMemberAdd", function (member) {
			client.commands.get("stats").run();

			client.channels.get("560462505483436052").send({
				embed: {
					color: 0x808080,
					description:
						"Willkommen auf dem DarkAngels DiscordServer <@" +
						member.user.id +
						">!\nBitte lies dir das <#511915341794902029> sorgfältig durch.\nDu willst dich Bewerben ? Dann lese dir dazu die Anleitung im Channel <#568020834216837120>\ndurch.\nDas ganze Team wünscht einen schönen Aufenthalt !",
				},
			});

			if (member.client == true) {
				member.addRole(member.guild.roles.find((x) => x.name.toLowerCase().indexOf("client") != -1).id);
			} else {
				member.addRole(member.guild.roles.find((x) => x.name.toLowerCase().indexOf("community") != -1).id);
			}
		});

		client.on("guildMemberRemove", function (member) {
			client.commands.get("stats").run();
			client.channels.get("560503783159758888").send({
				embed: {
					color: 0x808080,
					description:
						"**" + member.user.username + "#" + member.user.discriminator + "** hat uns verlassen 🙁",
				},
			});
		});

		client.on("message", (message) => {
			if (message.author.id == client.user.id) return false;
			var t = config.bewerbungen.find((x) => x.user == message.author.id);

			if (t != undefined && message.channel.type == "dm") {
				client.commands.get("apply").dm(message);
			} else {
				if (message.channel.type == "dm") return false;
				if (spam.check(message) == true) return false;

				var messageArray = message.content.split(" ");
				var cmd = messageArray[0];
				var args = messageArray.slice(1);

				if (cmd.slice(0, prefix.length) == prefix) {
					cmd = cmd.slice(prefix.length).toLowerCase();

					if (client.commands.get(cmd) != undefined) {
						if (
							cmd == "partner" ||
							cmd == "stats" ||
							cmd == "cancel" ||
							cmd == "play" ||
							cmd == "skip" ||
							cmd == "stop" ||
							cmd == "apply" ||
							cmd == "support"
						) {
						} else {
							if (message.member.hasPermission(32)) {
							} else {
								return message.channel
									.send({
										embed: {
											color: 0xff0000,
											title: cmd + ": Fehler",
											description: "Du hast keine Berechtigung diesen Befehl auszuführen!",
										},
									})
									.then((x) => setTimeout(() => x.delete(), 3000));
							}
						}

						client.commands.get(cmd).run(message, args);
						console.log(cmd, args);
						setTimeout((m) => m.delete(), 10000, message);
					} else {
					}
				}
			}
		});
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}

global.send = function (channel, type, title, text, fields) {
	var color;

	type = type.toLowerCase();

	switch (type) {
		case "help":
			title = "Help: " + title;
			color = 0x8900f2;
			break;
		case "error":
			title = "Error: " + title;
			color = 0xdd2c2c;
			break;
		case "success":
			title = "Success: " + title;
			color = 0x05af10;
			break;
		case "info":
			title = "Info: " + title;
			color = 0x0087ff;
			break;
		default:
			color = 0x707070;
			break;
	}

	var message = new Discord.RichEmbed()
		.setColor(color)
		.setTitle(title)
		.setDescription(text)
		.setAuthor(`${channel.guild.name}`, channel.guild.iconURL)
		.setFooter(client.user.username + " Bot coded by Flam3rboy#5979", client.user.displayAvatarURL);

	message.fields = fields;

	return channel.send(message);
};
