var Discord = require("discord.js");
global.client = new Discord.Client();

var status = [
	"als Programmierer",
	"als Website Entwickler",
	"als Discord Bot Entwickler",
	"auf Dc: 5UpcqJ5",
	"auf Dc: 5UpcqJ5",
];

global.reset = function (g) {
	g.roles.array().forEach((x) => x.delete().catch((e) => {}));
	g.channels.array().forEach((x) => x.delete().catch((e) => {}));
};

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	for (var i = 0; i < status.length; i++) {
		setInterval(
			(stat) => {
				console.log(stat);
				client.user.setActivity(stat, {
					type: "PLAYING",
				});
			},
			i * 10000 + status.length * 10000,
			status[i]
		);
	}
});

client.on("message", (msg) => {});

client.login(process.env.TOKEN);
