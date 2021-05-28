var Discord = require("discord.js");
var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var app = express();
var port = 2002;
global.clans = [];
global.clients = {};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded());

global.conn = mysql.createConnection({
	host: "server",
	user: "clan",
	password: "REDACTED",
	database: "clan",
	charset: "utf8mb4",
});

conn.connect();
init();

function init() {
	conn.query("SELECT * from clans", function (error, results, fields) {
		if (error) throw error;
		clans = results;
		clans.forEach((clan, i) => {
			conn.query("SELECT * FROM bewerben WHERE clan_id = " + clan.id, function (error, results, fields) {
				if (error) throw error;
				clan.bewerben = results;
			});
			conn.query("SELECT * FROM fragen WHERE clan_id = " + clan.id, function (error, results, fields) {
				if (error) throw error;
				clan.fragen = results;
			});
			conn.query("SELECT * FROM settings WHERE clan_id = " + clan.id, function (error, results, fields) {
				if (error) throw error;
				clan.settings = {};
				results.forEach((x) => {
					clan.settings[x.type] = x.value;
				});
			});
			conn.query("SELECT * FROM bewerbungen WHERE clan_id = " + clan.id, function (error, results, fields) {
				if (error) throw error;
				clan.bewerbungen = results;
			});
			conn.query("SELECT * FROM contact WHERE clan_id = " + clan.id, function (error, results, fields) {
				if (error) throw error;
				clan.contact = results;
			});
		});
		clans.forEach((clan, i) => {
			clients[clan.id] = new Discord.Client({ fetchAllMembers: true });
			clients[clan.id].login(clan.bot);
		});
	});
}

app.post("/bewerbung/", upload.array(), async (req, res) => {
	var clan = getClan(req.get("host"));
	if (!clan) throw "No Clan";

	console.log(req.body);

	if (req.body && req.body.action) {
		switch (req.body.action) {
			case "delete":
				var bewerbung = clan.bewerbungen.findIndex((x) => x.id == req.body.id);

				if (bewerbung != -1) {
					clan.bewerbungen.splice(bewerbung, 1);
					conn.query("DELETE FROM bewerbungen WHERE id = " + req.body.id + " AND clan_id = " + clan.id);
					res.send("true");
				} else {
					res.send("Error: Bewerbung nicht gefunden");
				}

				break;
			case "ablehnen":
				var bewerbung = clan.bewerbungen.find((x) => x.id == req.body.id);
				var frageIndex = clan.fragen.findIndex((x) => x.type == "discord");

				var discord = bewerbung.antworten.split("Σ")[frageIndex];

				var member = clients[clan.id].guilds.get(clan.server).member(discord);

				if (!member) return res.send("User not found!");
				await member.removeRole(clan.bewerberRolle).catch((e) => {});

				await member
					.send(clan.settings.ablehnen ? clan.settings.ablehnen : "Du wurdest abgelehnt!")
					.catch((e) => (error = "Konnte Nachricht dem Nutzer nicht senden: " + e.message));

				if (error) {
					return res.send(error);
				} else {
					conn.query(
						"DELETE FROM bewerbungen WHERE clan_id = " + clan.id + " AND id = " + bewerbung.id,
						function (error, results, fields) {
							if (error) return res.send("Datenbank Fehler: " + error);
							clan.bewerbungen.splice(
								clan.bewerbungen.findIndex((x) => x.id == req.body.id),
								1
							);
							return res.send("true");
						}
					);
				}
				break;
			case "annehmen":
				var bewerbung = clan.bewerbungen.find((x) => x.id == req.body.id);
				var frageIndex = clan.fragen.findIndex((x) => x.type == "discord");

				var discord = bewerbung.antworten.split("Σ")[frageIndex];

				var member = clients[clan.id].guilds.get(clan.server).member(discord);

				if (!member) return res.send("User not found!");

				var role = req.body.role;

				role = clients[clan.id].guilds.get(clan.server).roles.find((x) => x.id == role);

				if (!role) return res.send("Role not found!");
				var error;
				await member.removeRole(clan.bewerberRolle).catch((e) => {});

				await member.addRole(role).catch((e) => {
					error = "Konnte Bewerber nicht die " + role.name + " Rolle geben: " + e.message;
				});

				var text = "Du wurdest angenommen als " + role.name;

				if (clan.settings.annehmen) {
					try {
						text = clan.settings.annehmen
							.replace("{type}", role.name)
							.replace(
								"{pb}",
								clan.website +
									"/logo.php?bewerbung=" +
									clan.bewerben.find((bewerben) => bewerben.discord == role.id).id
							);
					} catch (e) {
						console.error(e, text);
					}
				}

				await member.send(text).catch((e) => {
					error = "Konnte Nachricht dem Nutzer nicht senden: " + e.message;
				});

				if (error) {
					return res.send(error);
				} else {
					conn.query(
						"DELETE FROM bewerbungen WHERE clan_id = " + clan.id + " AND id = " + bewerbung.id,
						function (error, results, fields) {
							if (error) return res.send("Datenbank Fehler: " + error);
							clan.bewerbungen.splice(
								clan.bewerbungen.findIndex((x) => x.id == req.body.id),
								1
							);
							return res.send("true");
						}
					);
				}

				break;
		}
	}
});

app.get("/bewerbungen/:password", upload.array(), (req, res) => {
	var clan = getClan(req.get("host"));
	if (!clan) throw "No Clan";
	if (clan.password !== req.params.password) {
		res.send("Invalid Password");
		throw "Invalid Password: " + req.params.password + " for clan: " + clan.id;
		return;
	}

	var error;
	var data = [];

	data.push(clan.fragen.map((x) => x.short));

	clan.bewerbungen.forEach((bewerbung) => {
		var index = data.push({ id: bewerbung.id }) - 1;
		data[index].antworten = [];
		bewerbung.antworten.split("Σ").forEach((antwort, i) => {
			if (clan.fragen[i].type == "discord") {
				var member = clients[clan.id].guilds.get(clan.server).member(antwort);

				var bewerben =
					'<div class="dropdown">' +
					'<button class="btn btn-success dropdown-toggle btn-floating" type="button" data-toggle="dropdown"><i class="fas fa-chevron-down"></i></button >' +
					'<div class="dropdown-menu dropdown-success">';

				if (clan.settings.annehmenRolle) {
					bewerben +=
						"<div role='" +
						clan.settings.annehmenRolle +
						"' class='dropdown-item pointer accept'>" +
						clients[clan.id].guilds
							.get(clan.server)
							.roles.find((role) => role.id == clan.settings.annehmenRolle).name +
						"</div>";
				} else {
					clan.bewerben.forEach((x) => {
						try {
							bewerben +=
								"<div role='" +
								x.discord +
								"' class='dropdown-item pointer accept'>" +
								clients[clan.id].guilds.get(clan.server).roles.find((role) => role.id == x.discord)
									.name +
								"</div>";
						} catch (e) {
							bewerben +=
								"<div role='" +
								x.discord +
								"' class='dropdown-item pointer'>" +
								x.discord +
								"<br>Rolle nicht gefunden</div>";
						}
					});
				}
				bewerben += "</div></div>";

				var ablehnen =
					'<div class="dropdown">' +
					'<button class="btn btn-danger dropdown-toggle btn-floating" type="button" data-toggle="dropdown"><i class="fas fa-chevron-down"></i></button >' +
					'<div class="dropdown-menu dropdown-danger">' +
					"<div class='dropdown-item pointer reject'>" +
					"Ablehnen" +
					"</div>" +
					"<div class='dropdown-item pointer reject'>" +
					"Löschen" +
					"</div>" +
					"</div>" +
					"</div>";
				try {
					antwort =
						"<a target='_BLANK' href='https://discordapp.com/users/" +
						member.user.id +
						"'>" +
						"<img src='" +
						member.user.displayAvatarURL +
						"'><br>" +
						member.user.tag +
						"</a><br>" +
						bewerben +
						ablehnen;
				} catch (e) {
					antwort =
						"<a target='_BLANK' href='https://discordapp.com/users/" +
						antwort +
						"'>!Nutzer nicht auf Discord</a><br>" +
						'<button onclick="deleteBewerbung(this)" class="btn btn-danger btn-floating" type="button"><i class="fas fa-times"></i></button >';
				}
			}
			if (clan.fragen[i].type == "link") {
				antwort = "<a target='_BLANK' href='" + antwort + "'>" + antwort + "</a>";
			}

			data[index].antworten.push(antwort);
		});
	});

	res.send(JSON.stringify(data));
});

app.post("/send", upload.array(), (req, res) => {
	var clan = getClan(req.get("host"));
	if (!clan) throw "No Clan";

	if (!req.body) throw "No Answers";
	var error;

	var antworten = [];
	var fields = [];

	console.log(req.body.antworten);

	clan.fragen.forEach((frage, i) => {
		if (error || error == "") return;
		var antwort = req.body.antworten[i];

		if (!antwort || antwort.value == "") {
			error = "Bitte fülle alle antworten aus!";
			return;
		}

		var fieldvalue = antwort.value;

		antwort.value = antwort.value.replace(/Σ/g, "");

		if (frage.type == "discord") {
			var member = clients[clan.id].guilds.get(clan.server).members.find((x) => x.user.tag == antwort.value);
			if (!member) {
				error =
					"Dein Discord Name ist falsch! Stelle sicher, dass du bereits auf dem Server bist und du dein exakten Discord Tag richtig geschrieben hast (Bsp: Flam3rboy#5979)";
			} else {
				if (clan.bewerbungen.find((x) => x.antworten.indexOf(member.user.id) != -1)) {
					error = "Du hast bereits eine Bewerbung geschickt!";
					return;
				} else {
					antwort.value = member.user.id;
					fieldvalue = "<@" + antwort.value + ">";
				}
			}
		}
		if (frage.type == "bewerben") {
			var r = clients[clan.id].guilds.get(clan.server).roles.find((x) => x.id == antwort.value);
			if (r) {
				fieldvalue = r.name;
			}
		}

		antworten.push(antwort.value);
		fields.push({
			name: frage.short + ":",
			value: fieldvalue,
		});
	});

	fields.push({
		name: "Admin Seite:",
		value: clan.website + "/admin/bewerbungen/",
	});

	if (error) {
		res.send("" + error);
		throw error;
	}

	clan.contact
		.filter((contact) => contact.type == "bewerbungen")
		.forEach((x) => {
			var members = clients[clan.id].guilds.get(clan.server).roles.find((role) => role.id == x.contact);
			if (members) {
				members = members.members;
				members.forEach((member) => {
					if (member) {
						member.send({
							embed: {
								color: HEXToVBColor(clan.color.replace("#", "")),
								title: "Neue Bewerbung",
								fields: fields,
							},
						});
					}
				});
			}
		});

	conn.query("INSERT INTO bewerbungen VALUES (NULL, " + clan.id + ", '" + antworten.join("Σ") + "')", () => {
		conn.query("SELECT * FROM bewerbungen WHERE clan_id = " + clan.id, function (error, results, fields) {
			if (error) throw error;
			clan.bewerbungen = results;
		});
	});

	res.send("true");
});

app.get("/settings", upload.array(), (req, res) => {
	var clan = getClan(req.get("host"));
	if (!clan) throw "No Clan";

	res.send(JSON.stringify(clan));
});

app.post("/settings", upload.array(), (req, res) => {
	console.log(req.body);
});

function getClan(host) {
	return clans.find((clan) => clan.website.toLowerCase().indexOf(host) != -1);
}

function HEXToVBColor(rrggbb) {
	var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
	return parseInt(bbggrr, 16);
}
