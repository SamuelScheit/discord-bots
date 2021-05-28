global.Discord = require("discord.js");
global.client = new Discord.Client();
global.fs = require("fs");
var express = require("express");
global.tmi = require("tmi.js");
global.config = require("./ParmaGames.json");
global.app = express();

app.listen(2000, () => {
	console.log("Listening on port: *:2000");
});

function authUser(res, pass) {
	var t = config.find((x) => x.password == pass);
	if (t == undefined) {
		res.send("E: Passwort ungültig");
		return 0;
	} else {
		return t;
	}
}

app.get("/user/:pass/", (req, res) => {
	var t = authUser(res, req.params.pass);
	if (t != 0) {
		res.send(t);
		return 0;
	}
});

app.get("/user/:pass/buy/:credits", (req, res) => {
	var t = authUser(res, req.params.pass);
	if (t != 0) {
		if (req.params.credits > 0) {
			if (t.xp - req.params.credits >= 0) {
				t.xp -= req.params.credits;
				res.send(t.xp.toString());
				return 0;
			} else {
				res.send("E: Nicht genügeng PG");
				return 0;
			}
		}
	}
});

const opts = {
	identity: {
		username: "flam3rboy3",
		password: "rysenvxzogtz70aibvuz63ct7niq03",
	},
	channels: ["parmagames"],
};

global.credits = {
	message: 1,
	view: 15,
	join: 20,
	leaves: 30,
	invite: 20,
	resub: 50,
	sub: 100,
};

global.generatePassword = function () {
	var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!§$&()=*+#-_.:,;";
	var pwdLen = 20;
	return Array(pwdLen)
		.fill(pwdChars)
		.map(function (x) {
			return x[Math.floor(Math.random() * x.length)];
		})
		.join("");
};

global.user = function (tid, did, credits) {
	if (credits == undefined) {
		this.xp = 0;
	} else {
		this.xp = credits;
	}

	this.password = generatePassword();
	this.twitch = tid;
	this.discord = did;
};

function addCredit(id, amount, type) {
	switch (type) {
		case "t":
			var t = config.find((x) => x.twitch == id);
			if (t == undefined) {
				t = config.push(new user(id, "", amount));
				config[t - 1].xp += amount;
			} else {
				t.xp += amount;
			}

			break;
		case "d":
			var t = config.find((x) => x.discord == id);

			if (t == undefined) {
				t = config.push(new user("", id, amount));
				config[t - 1].xp += amount;
			} else {
				t.xp += amount;
			}

			break;
	}
}

global.getLevel = function (xp) {
	var t = levels.findIndex((x) => xp < x);
	if (t == -1) {
		t = levels.length;
	}
	return t;
};

var levels = [0, 150, 250, 350, 450];

//orc43btmcvi2oc81gtrab20fgwlt2puej50eggtygj0mlqqtsw

global.twitch = new tmi.client(opts);

twitch.on("message", function (target, context, msg, self) {
	if (self == false) {
		addCredit(context["user-id"], credits.message, "t");

		var t = config.find((x) => x.twitch == context["user-id"]);

		if (t == undefined) {
			t = { xp: 0 };
		}

		switch (msg) {
			case "!rank":
				twitch.say(target, "Ahoi " + context["display-name"] + "! Du hast momentan " + t.xp + " PG");
				break;
			case "!shop":
				twitch.say(target, "Das Shop-Passwort wurde dir privat geschickt.");
				var t = twitch.whisper(
					context.username,
					"Website: http://parmagames.de  ‏‏‎  ‏‏‎  Dein internes Passwort lautet: " +
						config.find((x) => x.twitch == context["user-id"]).password
				);
				break;
		}
		console.log(t);

		console.log(target, context, msg, self);
	}
});

twitch.on("connected", function (addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
});
twitch.on("join", function (channel, username, self) {
	if (self == false) {
		console.log("join", channel, username, self);
	}
});

twitch.on("raw_message", (messageCloned, message) => {
	// console.log("raw", message);
	if (message.raw.indexOf("whisper_restricted_recipient") != -1) {
		twitch.say(
			"parmagames",
			'Konnte DM nicht senden, weil "Flüsternachrichten von unbekannten Benutzern blockieren" eingeschaltet ist in den Einstellungen unter Sicherheit und Privatsphäre'
		);
	}
});

global.rssParse = require("rss-parser");

global.parser = new rssParse({
	defaultRSS: 2.0,
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);

	setInterval(() => {
		updateConfig();
	}, 1000 * 60 * 5);

	global.server = client.guilds.array().find((x) => x.id == "554976639612616714");
	global.wowsNews = server.channels.array().find((x) => x.id == "554978530925215745");

	wowsNews.fetchMessages({ limit: 100 }).then(() => {
		wowsNewsRSS();
	});

	setInterval(function () {
		wowsNewsRSS();
	}, 1000 * 60 * 60); // jede Stunde
});

client.on("message", (msg) => {
	console.log(msg);
	if (msg.member != null) {
		addCredit(msg.member.id, credits.message, "d");
	}
});

client.on("guildMemberAdd", (member) => {
	addCredit(member.id, credits.join, "d");
});

client.login(process.env.TOKEN);
twitch.connect();

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

function updateConfig() {
	fs.writeFile("ParmaGames.json", JSON.stringify(global.config), function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("Config Updated");
	});
}
