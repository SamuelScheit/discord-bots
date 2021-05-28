module.exports.init = () => {
	client.on("presenceUpdate", (oldMember, newMember) => {
		if (
			getOnline(oldMember.presence.status) ==
			getOnline(newMember.presence.status)
		) {
			return false;
		}

		if (newMember.roles.find(x => x.id != ""))
			var u = config.users.find(x => x.user == newMember.user.id);

		if (u) {
			if (getOnline(newMember.presence.status) == false) {
				u.onlineTime += new Date().getTime() - u.last;
			}
			u.last = new Date().getTime();
		} else {
			config.users.push(new userPresence(newMember.user.id));
		}

		// console.log(
		// 	oldMember.user.username + ": " + oldMember.presence.status,
		// 	newMember.user.username + ": " + newMember.presence.status
		// );
	});
	// sendActivity(client.channels.get("568061022951440394"));
};

function sendActivity(channel) {
	var description = [];
	var i = 0;

	config.users = config.users.sort((a, b) => {
		if (a.onlineTime > b.onlineTime) {
			return -1;
		} else if (a.onlineTime < b.onlineTime) {
			return 1;
		} else {
			return 0;
		}
	});

	config.users.forEach(user => {
		if (description[i] == undefined) {
			description[i] = "";
		}

		if (description[i].length > 1950) {
			i++;
			description[i] = "";
		}

		description[i] += dhm(user.onlineTime) + ": <@" + user.user + ">\n";
	});

	description.forEach(d => {
		// channel.send({
		// 	embed: {
		// 		author: {
		// 			name: client.user.username,
		// 			icon_url: client.user.avatarURL
		// 		},
		// 		color: 0xff0000,
		// 		title: "Nutzer Aktivität [Tage Stunden:Minuten]",
		// 		description: d
		// 	}
		// });
	});
}

function userPresence(userid) {
	this.user = userid;
	this.onlineTime = 0;
	this.last = new Date().getTime();
}

function getOnline(status) {
	switch (status) {
		case "offline":
			return false;
			break;
		case "idle":
		case "dnd":
		case "online":
			return true;
			break;
		default:
			return false;
			break;
	}
}

function dhm(t) {
	var cd = 24 * 60 * 60 * 1000,
		ch = 60 * 60 * 1000,
		d = Math.floor(t / cd),
		h = Math.floor((t - d * cd) / ch),
		m = Math.round((t - d * cd - h * ch) / 60000),
		pad = function(n) {
			return n < 10 ? "0" + n : n;
		};
	if (m === 60) {
		h++;
		m = 0;
	}
	if (h === 24) {
		d++;
		h = 0;
	}

	if (d == 0) {
		return pad(h) + ":" + pad(m);
	} else {
		return d + "d " + pad(h) + ":" + pad(m);
	}
}
