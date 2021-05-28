var Discord = require("discord.js");
global.client = new Discord.Client();
global.request = require("request");

global.invites = [];

global.text =
	"Vexum [VXM]\nPlattformen: PC und Ps4\nDu bist auf der Suche nach einem chilligen Clan, mit sympathischen Mitgliedern.\nDann bist du bei Vexum genau richtig!\n\nWas bieten wir dir?\n	? Einen gut aufgebauten Discord\n	? Freundliche Mitglieder \n	? Die Möglichkeit aufzusteigen\n	? Turniere etc.\n	? Eine coole Atmosphäre in unserem Team\n\nWas brauchst du für Anforderungen?\n	💥 E-Sports Member\n	? 300+ Wins\n	? 2,0 KD/Lifetime\n\n	💥 Competitive Member+\n	? 250+ Wins\n	? 1,5 KD/Lifetime\n\n	💥 Competitive Member\n	? 150+ Wins\n	? 1,0 KD/Lifetime\n\n	💥 Casual Member\n	? 50+ Wins\n\n	? +12 Jahre | Geistige Reife\n	? Respektvoller Umgangston\n	? Ein Mikrofon besitzen\n	? Namens änderung\n	? PB änderung\n\n\nBei Interesse \n\n💥 Dm an <@349124972171624450>\noder http://vexum.ddns.net/#home\n👑 Viel Erfolg! 👑\nWIR FREUEN UNS AUF DICH\n[https://discord.gg/ua6fydU]";

global.i = 0;

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.guilds
		.first()
		.fetchMembers()
		.then(() => {
			cycle();
		});
});

function cycle() {
	if (i < client.guilds.first().members.array().length) {
		setTimeout(
			function (m) {
				console.log(i);
				i++;
				m.send(text);
				cycle();
			},
			1000 * 60 * 5,
			client.guilds.first().members.array()[i]
		);
	}
}

global.Guild = function (guild) {
	console.log(guild.name);

	request(
		{
			headers: {
				Authorization: token,
			},
			uri:
				"https://discordapp.com/api/v6/guilds/" +
				guild.id +
				"/messages/search?content=https%3A%2F%2Fdiscord.gg%2F",
			method: "GET",
		},
		function (err, res, body) {
			body = JSON.parse(body);
			console.log(body);
			try {
				if (body.message == "You are being rate limited.") {
					var i = 0;
					console.log(body.message);
				} else {
					body.messages.forEach((msg) => {
						msg = msg.filter((x) => x.hit == true);
						msg = msg.map((x) =>
							x.content.slice(
								x.content.indexOf("https://discord.gg/"),
								x.content.indexOf("https://discord.gg/") + 26
							)
						)[0];
						if (msg != "") {
							setTimeout(() => {
								console.log(msg);
								joinGuild(msg);
							}, Math.random() * 10000000 + 10000);
							invites.push(msg);
						}
					});
				}
			} catch (e) {
				console.log(e);
			}
		}
	);
};

global.joinGuild = function (invite) {
	invite = invite.replace("https://discord.gg/", "");
	request(
		{
			headers: {
				Authorization: tokenGuild(client.guilds.last()),
			},
			uri: "https://discordapp.com/api/v6/invite/" + invite,
			method: "POST",
		},
		function (err, res, body) {
			console.log(JSON.parse(body));
			if (body.message == "You are being rate limited.") {
			}
		}
	);
};

client.login(process.env.TOKEN);
