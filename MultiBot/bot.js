var Discord = require("discord.js");
global.client = new Discord.Client();
var load = require("./load");

load.init(Discord);

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.on("guildMemberAdd", function (member) {
		client.commands.get("stats").run();

		if (member.bot == true) {
			member.addRole(member.guild.roles.find((x) => x.name.toLowerCase().indexOf("bot") != -1).id);
		} else {
			member.addRole(member.guild.roles.find((x) => x.name.toLowerCase().indexOf("community") != -1).id);
		}
	});

	client.on("guildMemberRemove", function () {
		client.commands.get("stats").run();
	});

	client.on("message", (message) => {
		if (message.author.id == client.user.id) return false;
		if (message.channel.type == "dm") return false;

		var messageArray = message.content.split(" ");
		var cmd = messageArray[0];
		var args = messageArray.slice(1);

		if (cmd.slice(0, prefix.length) == prefix) {
			cmd = cmd.slice(prefix.length).toLowerCase();

			if (client.commands.get(cmd) != undefined) {
				client.commands.get(cmd).run(message, args);
				console.log(cmd, args);
			} else {
			}
		}
	});
});

client.login(process.env.TOKEN);
