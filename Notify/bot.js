global.Discord = require("discord.js");
global.JSON = require("circular-json");
global.express = require("express");
global.app = express();
global.twitch = require("twitch-api-v5");

app.listen(2004);

global.web = require(__dirname + "/api/index.js");

global.client = new Discord.Client();
global.jsonfile = require("jsonfile");
global.fs = require("fs");

global.file = __dirname + "/data.json";
global.config = require(__dirname + "/config.json");
global.sort = require(__dirname + "/sort.js");
global.data = require(__dirname + "/data.json");
global.ln = {};

client.commands = new Discord.Collection();

var defaultPrefix = "!";

global.getNumberFromEmoji = function (s) {
	var reaction_numbers = [
		"\u0030\u20E3",
		"\u0031\u20E3",
		"\u0032\u20E3",
		"\u0033\u20E3",
		"\u0034\u20E3",
		"\u0035\u20E3",
		"\u0036\u20E3",
		"\u0037\u20E3",
		"\u0038\u20E3",
		"\u0039\u20E3",
	];

	for (var i = 0; i < reaction_numbers.length; i++) {
		if (reaction_numbers[i] == s) {
			return i.toString();
		}
	}
};

global.getEmojiFromNumber = function (s) {
	switch (s) {
		case "0":
			return "0️⃣";
			break;
		case "1":
			return "1️⃣";
			break;
		case "2":
			return "2️⃣";
			break;
		case "3":
			return "3️⃣";
			break;
		case "4":
			return "4️⃣";
			break;
		case "5":
			return "5️⃣";
			break;
		case "6":
			return "6️⃣";
			break;
		case "7":
			return "7️⃣";
			break;
		case "8":
			return "8️⃣";
			break;
		case "9":
			return "9️⃣";
			break;
	}
};

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

fs.readdir(__dirname + "/language/", {}, (err, file) => {
	if (err) console.error(err);

	var jsfile = file.filter((f) => f.split(".").pop() === "json");

	if (jsfile.length <= 0) console.log("Couldn't find any language files");

	jsfile.forEach((f, i) => {
		let props = require(__dirname + "/language/" + f);
		ln[f.replace(".json", "")] = props;
		console.log(f + " loaded!");
	});
});

global.dataJson = function (id) {
	this.active = true;
	this.serverId = id;
	this.ln = "en";
	this.prefix = defaultPrefix;
};

global.updateData = function () {
	jsonfile
		.writeFile(file, data)
		.then((res) => {
			console.log("Saved data");
		})
		.catch((error) => console.error(error));
};

try {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);
		client.guilds.array();

		web.init();

		client.on("message", (message) => {
			if (message.author.id != "555481316905320448" && message.channel.type == "text") {
				var messageArray = message.content.split(" ");
				var conf = data.findIndex((x) => x.serverId == message.guild.id);
				var prefix = data[conf].prefix;
				var cmd = messageArray[0];
				var args = messageArray.slice(1);

				if (cmd.slice(0, prefix.length) == prefix) {
					cmd = cmd.slice(prefix.length);
					if (client.commands.get(cmd) != undefined) {
						client.commands.get(cmd).run(message, args, conf);
					}
				}
			}
		});

		client.on("guildCreate", (guild) => {
			console.log("Joined a new guild: " + guild.name);
			data.push(new dataJson(guild.id));
			console.log(data);
			updateData();
		});

		client.on("guildDelete", (guild) => {
			console.log("Left a guild: " + guild.name);
			console.log(data.find((x) => x.serverId == guild.id));
			updateData();
		});
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}
