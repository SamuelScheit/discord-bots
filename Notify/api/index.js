module.exports.init = function() {
	app.get("/members/:id", function(req, res) {
		var members = [];

		client.guilds
			.get(req.params.id)
			.members.array()
			.forEach(x => {
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
						user: x
					});
				} catch (e) {
					var t = 0;
				}
			});
		members = members.sort(sort.members);
		res.send(JSON.stringify(members));
	});
	app.get("/roles/:id", function(req, res) {
		var roles = client.guilds
			.get(req.params.id)
			.roles.array()
			.sort(sort.sortRole);

		res.send(JSON.stringify(roles));
	});
	app.get("/servers/", function(req, res) {
		res.send(JSON.stringify(client.guilds.array()));
	});
	app.get("/icon/:type/:id", function(req, res) {
		switch (req.params.type) {
			case "server":
				res.send(client.guilds.get(req.params.id).iconURL);
				break;
			case "user":
				var u;
				client.guilds.array().forEach(x => {
					u = x.members.find(y => y.id == req.params.id);
					if (u != undefined) {
						res.send(u.user.avatarURL);
					}
				});
				break;
			default:
				res.send("");
				break;
		}
	});
	app.get("/language/", function(req, res) {
		res.send(ln);
	});
	app.get("/config/", function(req, res) {
		res.send(data);
	});
	app.get("/config/:id/:key/:val", function(req, res) {
		data.find(x => x.serverId == req.params.id)[req.params.key] =
			req.params.val;
		updateData();
		res.send("");
	});
};
