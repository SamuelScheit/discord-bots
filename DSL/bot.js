global.Discord = require("discord.js");
global.Util = require("discord.js");
global.client = new Discord.Client();
global.fs = require("fs");
global.jsonfile = require("jsonfile");

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
		client.commands.set(f.replace(".js", ""), props);
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

		client.user.setActivity("!help");

		client.guilds
			.first()
			.channels.filter((x) => x.type == "text")
			.forEach((channel) => channel.fetchMessages());

		setInterval(() => {
			updateConfig();
		}, 1000 * 60 * 5);

		client.on("message", (message) => {
			if (message.author.id == client.user.id) return false;
			if (message.channel.type == "dm") return false;

			var messageArray = message.content.split(" ");
			var cmd = messageArray[0];
			var args = messageArray.slice(1);

			if (cmd.slice(0, prefix.length) == prefix) {
				cmd = cmd.slice(prefix.length).toLowerCase();

				client.commands.get(cmd).run(message, args);
			}
		});
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}
