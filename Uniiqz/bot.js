global.Discord = require("discord.js");
global.client = new Discord.Client();
global.fs = require("fs");
global.jsonfile = require("jsonfile");

global.config = require(__dirname + "/config.json");

client.commands = new Discord.Collection();

var prefix = "!";

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
		setInterval(() => {
			updateConfig();
		}, 1000 * 60 * 5);

		client.user.setActivity(" auf -help", {
			type: "LISTENING",
		});

		client.on("message", (message) => {
			if (message.author.id != client.user.id) {
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
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}
