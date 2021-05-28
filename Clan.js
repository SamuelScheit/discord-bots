var Discord = require("discord.js");
global.client = new Discord.Client();
global.express = require("express");
var JSON = require("circular-json");
var mysql = require("mysql");

global.con = mysql.createConnection({
	host: "server",
	user: "clan",
	password: "REDACTED",
	database: "clan",
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Database Connected!");
});

global.clans;

con.query("SELECT * FROM clans", (err, result, fields) => {
	clans = result;
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

app.get("/members/:id", function (req, res) {
	var members = [];

	client.guilds
		.get(req.params.id)
		.members.array()
		.forEach((x) => {
			var role = x.roles.array().sort(sort.sortRole);
			try {
				var name = x.user.username;
				if (x.nickname) {
					name = x.nickname;
				}

				members.push({
					username: x.user.username,
					tag: x.user.tag,
					position: role[0].position,
					role: role[0].name,
					roles: role,
					id: x.user.id,
					color: x.displayHexColor,
					user: x,
				});
			} catch (e) {
				var t = 0;
			}
		});
	members = members.sort(sort.members);
	res.send(JSON.stringify(members));
});

client.login(process.env.TOKEN);
