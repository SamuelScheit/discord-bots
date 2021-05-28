var Discord = require("discord.js");
global.client = new Discord.Client();
var express = require("express");
var fs = require("fs");
var app = express();

global.config = require("./settings.json");

global.updateConfig = function () {
	fs.writeFile(__dirname + "/settings.json", JSON.stringify(config), (res) => {
		console.log("Saved config");
	});
};

app.use("/", express.static("static"));

app.get("/config", function (req, res) {
	var servers = [];

	servers.push(config);

	client.guilds.array().forEach((e) => {
		var server = {};

		server.channels = e.channels
			.array()
			.filter((x) => x.type == "text")
			.map((x) => {
				return { id: x.id, name: x.name, position: x.position };
			});
		server.name = e.name;
		server.id = e.id;
		server.icon = e.icon;

		servers.push(server);
	});

	res.send(JSON.stringify(servers));
});

app.get("/config/:id/:channel/:frequency", function (req, res) {
	var t = config.find((x) => x.id == req.params.id);

	if (t == undefined) {
		config.push({
			id: req.params.id,
			channel: req.params.channel,
			frequency: req.params.frequency,
			last: 0,
		});
	} else {
		t.channel = req.params.channel;
		t.frequency = req.params.frequency;
	}

	res.send("OK");
});

app.post("/config/:id", function (req, res) {
	var t = config.findIndex((x) => x.id == req.params.id);
	if (t != -1) {
		config.splice(t, 1);
	}

	res.send("OK");
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	setInterval(() => {
		updateConfig();
	}, 1000 * 60 * 5);

	setInterval(function () {
		config.forEach((x) => {
			var days = (new Date() - new Date(x.last)) / (1000 * 3600 * 24);

			if (days > parseInt(x.frequency)) {
				console.log("send Partner nachricht zu " + client.guilds.get(x.id).name);
				x.last = new Date().getTime();
				send(client.guilds.get(x.id).channels.get(x.channel));
			}
		});
	}, 1000 * 20);
});

global.send = function (x) {
	var error = false;
	x.send(
		"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n                   ** • SlyZe ᴇSᴘᴏʀᴛs •\n         →_Fortnite ᴇSᴘᴏʀᴛs Clan_←**\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n**« Wer sind wir? »**\n➥ Wir sind ein deutschsprachiger Clan, der sich in Richtung eSports orientieren will.\n➥ Wir suchen talentierte Fortnite Spieler, die Lust auf Erfolg haben. \n➥ Wenn Ihr keine Lust auf Solo habt, dann joint gerne dem Discord. \n➥ Außerdem organisieren wir ebenso Turniere und Rotation Games.\n➥ Wenn wir Interesse geweckt haben, dann bewerbe dich gerne!\n➥ Wir wurden am 11.03.2019 gegründet. \n\n**« Was bieten wir Dir? »**\n➥ Einen professionellen Discord  \n➥ Ein freundliches Team \n➥ Schnellen Support \n➥ Sponsoren \n➥ Turniere mit Preisgeld \n➥ Eigenes Logo \n➥ Eigene Website \n➥ Eigenen Discord Bot \n➥ Eigenes Rotation Games System \n➥ Creator Code  \n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n**« Wie kannst du unserem Clan beitreten?»**\n\n➥ Bewirb dich auf unserer Website als SlyZe Member:\n     http://slyze.ddns.net/#bewerben\n\n:zap:️Fortnite - Member:zap:️\n➥ 1,5 K/D (Ausnahmen möglich)\n➥ 200+ Wins (Ausnahmen möglich)\n➥ Geistige Reife\n➥ Aktivität auf dem Discord\n➥ Erfahrung in Fortnite\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n**« Was kann ich machen wenn ich nicht in den Clan möchte? »**\n➥ die öffentlichen Sprachchannel nutzen\n➥ mit anderen Leuten auf dem Discord sprechen und schreiben\n➥ Mitspieler für **Duo** oder **Squad** finden \n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n» Haben wir deine Interesse geweckt?\n\n__**OFFIZIELLER DISCORD:**__https://discord.gg/tzjpyXY\n\nMit freundlichen Grüßen,\nEuer **SlyZe eSports Team**\n\n@everyone"
	);
};

client.login(process.env.TOKEN);

app.listen(1000, function () {
	console.log("Example app listening on port 1000!");
});
