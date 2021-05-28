var Discord = require("discord.js");
global.client = new Discord.Client();

global.rssParse = require("rss-parser");

global.parser = new rssParse({
	defaultRSS: 2.0,
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	global.TeamKarpaServer = client.guilds.array().find((x) => x.id == "525638566274007060");
	global.Bayern3Raum = TeamKarpaServer.channels.array().find((x) => x.id == "526447630084210689");
	global.wowsNews = TeamKarpaServer.channels.array().find((x) => x.id == "550346135458545696");

	wowsNews.fetchMessages({ limit: 100 }).then(() => {
		wowsNewsRSS();
	});

	setInterval(function () {
		wowsNewsRSS();
	}, 1000 * 60 * 60); // jede Stunde
});

client.login(process.env.TOKEN);

function wowsNewsRSS() {
	parser.parseURL("https://worldofwarships.eu/de/rss/news/", function (err, feed) {
		var i = 0;
		var messages = wowsNews.messages.array().map((x) => x.content);
		feed.items = feed.items.reverse();

		feed.items.forEach(function (entry) {
			var message =
				entry.title + ": " + entry.link + "\n" + entry.contentSnippet.replace("Lesen Sie weiter", "").trim();

			if (messages.filter((x) => x.indexOf(entry.title) != -1).length == 0) {
				setTimeout(() => {
					wowsNews.send(message);
				}, i);
				i += 2000;
			}
		});
	});
}
