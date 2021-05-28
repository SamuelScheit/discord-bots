global.Discord = require("discord.js");
global.client = new Discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.guilds.first().channels.get("556638029595279370").fetchMessages();
	client.guilds.first().channels.get("556635971073081385").fetchMessages();
	client.user.setPresence({
		game: { name: "coded by Flam3rboy" },
		status: "PLAYING",
	});
});

client.on("message", (msg) => {
	if (msg.content == "!pro") {
		msg.channel.send(
			"<@" +
				msg.author.id +
				"> Pro wird man indem man gut spielt, und wir das deutlich merken. Natürlich bekommt ihr auch Pro wenn ihr Content Creator seit, die für ihre Competitive Erfahrung bekannt sind."
		);
	}
	if (msg.content == "!rules") {
		msg.channel.send("Bitte lies dir den <#556635971073081385> Channel durch! Danke");
	}
	if (msg.content == "!bewerben") {
		msg.channel.send(
			"<@" +
				msg.author.id +
				"> Schreibt einfach in den channel <#556641581311066134> %apply, der Application Bot wird euch anschreiben, beantwortet einfach die fragen die gestellt werden."
		);
	}
});

client.on("guildMemberAdd", function (member) {
	var text =
		"Hallo! Willkommen auf dem **asap eSports** Discord! Du hast Interesse an unserem Team? Erstmal musst du diese Dinge tun :\n\n__Lies dir folgende Channel durch!__: **\n\n-<#556635971073081385>\n-<#556638029595279370>\n-<#556643726022279189>**\n\nFalls du Interesse hast, schreibe in den <#556641581311066134> Channel ``%apply%`` hinein.\nFalls du jedoch keine Interesse hast, kannst du natürlich auf unserem Discord bleiben, folgende Dinge werden auf dich zukommen :\n\n-**Preisgeld Turniere**\n-**Immer neue Team updates**\n-**eine starke Community, mit denen du z.B. Pubs / Scrims spielen kannst**\n\n";

	member.addRole("556629221762400278");
	member.user.send(text);
	updateServerStats();
});

client.on("messageReactionAdd", function (reaction, user) {
	switch (reaction.message.id) {
		case "561193730800091149":
			client.guilds.first().members.get(user.id).addRole("556866815087738890");
			break;
		case "562655308283904010":
			client.guilds.first().members.get(user.id).addRole("562649784696045579");
			break;
	}
});

client.on("messageReactionRemove", function (reaction, user) {
	switch (reaction.message.id) {
		case "561193730800091149":
			client.guilds.first().members.get(user.id).removeRole("556866815087738890");
			break;
		case "562655308283904010":
			client.guilds.first().members.get(user.id).removeRole("562649784696045579");
			break;
	}
});

client.on("guildMemberRemove", function () {
	updateServerStats();
});

function updateServerStats() {
	client.guilds
		.first()
		.channels.get("556632477133832222")
		.setName("Member Anzahl: " + client.guilds.first().memberCount);

	var botsCounter = 0;

	client.guilds
		.first()
		.members.array()
		.forEach(function (member) {
			if (member.user.bot == true) {
				botsCounter += 1;
			}
		});

	client.guilds
		.first()
		.channels.get("556632478237065216")
		.setName("Bot Anzahl: " + botsCounter);
}

client.login(process.env.TOKEN);
