global.Discord = require("discord.js");
global.Util = require("discord.js");
global.YouTube = require("simple-youtube-api");
global.ytdl = require("ytdl-core");
global.youtube = new YouTube("REDACTED");

global.client = new Discord.Client();
global.fs = require("fs");
global.jsonfile = require("jsonfile");

global.spam = require(__dirname + "/commands/extra/spam.js");
global.config = require(__dirname + "/config.json");
global.badwords;

fs.readFile(__dirname + "/badwords.txt", "utf8", function (err, data) {
	if (err) throw err;
	badwords = data.split("\n");
});

client.commands = new Discord.Collection();

var prefix = "-";

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

		client.user.setActivity(" auf -help", {
			type: "LISTENING",
		});

		client.on("guildMemberAdd", function (member) {
			client.commands.get("stats").run();

			if (member.bot == true) {
				member.addRole(member.guild.roles.find((x) => x.name.toLowerCase().indexOf("bot") != -1).id);
			} else {
				member.addRole(member.guild.roles.find((x) => x.name.toLowerCase().indexOf("community") != -1).id);
			}

			member.guild
				._sortedChannels()
				.find((x) => x.type == "text")
				.send("Hey <@" + member.user.id + ">, welcome to **" + client.guilds.first().name + "**🎉🤗 !");

			member.send(
				"Herzlich Willkommen auf dem B8 eSports Discord.\n\n-----------------------------------------------------------------------------------------\n\nMit dem Beitritt des Servers empfehlen wir dir dringend die Regeln die in <#567681158557597696> zu finden sind durch zu lesen, wenn du dies nicht tust ist die Gefahr sehr groß durch das brechen einer Regeln gebannt zu werden.\n\nDazu nehmen wir **KEINE HAFTUNG** wenn du die Regeln nicht durchgelesen hast!!!\n\n-----------------------------------------------------------------------------------------\n\nYouTube: https://www.youtube.com/channel/UCbO2Zna_Vpm7mfcbgnPeBpw \nInstagram: http://www.instagram.com/b8.esports/\n\n-----------------------------------------------------------------------------------------\n\nViel Spaß noch auf dem Server :smiley:"
			);
		});

		client.on("guildMemberRemove", function () {
			client.commands.get("stats").run();
		});

		client.on("message", (message) => {
			if (message.author.id != "564432377175212052") {
				if (message.channel.type == "dm") {
				}
				var messageArray = message.content.split(" ");
				var cmd = messageArray[0];
				var args = messageArray.slice(1);

				if (cmd.slice(0, prefix.length) == prefix) {
					cmd = cmd.slice(prefix.length).toLowerCase();

					if (client.commands.get(cmd) != undefined) {
						client.commands.get(cmd).run(message, args);
						return;
					}
				}
				spam.check(message);
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
		.setFooter(client.user.username + " Bot coded Flam3rboy#5979", client.user.displayAvatarURL);

	message.fields = fields;

	return channel.send(message);
};
