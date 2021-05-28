var Discord = require("discord.js");
global.client = new Discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.channels.get("568444255878643735").fetchMessages();
	client.on("messageReactionAdd", (reaction, user) => {
		if (reaction.message.author.id == client.user.id) {
			switch (reaction.emoji.name) {
				case "⌨":
					client.guilds.first().member(user).addRole("568493937720033282");
					break;
				case "🎮":
					client.guilds.first().member(user).addRole("568493887899959319");
					break;
			}
		}
	});
	client.on("messageReactionRemove", (reaction, user) => {
		if (reaction.message.author.id == client.user.id) {
			switch (reaction.emoji.name) {
				case "⌨":
					client.guilds.first().member(user).removeRole("568493937720033282");
					break;
				case "🎮":
					client.guilds.first().member(user).removeRole("568493887899959319");
					break;
			}
		}
	});
});

client.login(process.env.TOKEN);
