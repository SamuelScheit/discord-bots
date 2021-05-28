//📊 Server Stats 📊

module.exports.run = async function(message, args, conf) {
	var permissions = [
		{
			allowed: 1049600,
			id: "568095616534708224"
		},
		{
			denied: 1048576,
			id: client.guilds
				.first()
				.roles.array()
				.find(x => (x.name = "@everyone")).id
		}
	];

	var category = client.guilds
		.first()
		.channels.find(x => x.name.indexOf("DarkAngels® DE - Discord") != -1);

	if (category) {
	} else {
		client.guilds
			.first()
			.createChannel("DarkAngels® DE - Discord", "category", permissions)
			.then(x => {
				category = x;
				x.setPosition(0, false);
			});
	}

	client.guilds.first().fetchMembers();

	var member = client.guilds
		.first()
		.channels.find(x => x.name.indexOf("Clan Member: ") != -1);

	var memberCount = 0;

	client.guilds
		.first()
		.roles.filter(
			x =>
				x.id == "511915434157670429" ||
				x.id == "511915484371746817" ||
				x.id == "538348375725047809" ||
				x.id == "538065885525442571" ||
				x.id == "538348164990763014" ||
				x.id == "542791300605542432"
		)
		.forEach(role => {
			memberCount += role.members.size;
		});

	if (member) {
		member.setName("Clan Member: " + memberCount);
	} else {
		client.guilds
			.first()
			.createChannel("Clan Member: " + memberCount, "voice", permissions)
			.then(x => {
				member = x;
				x.setParent(category);
			});
	}

	var member = client.guilds
		.first()
		.channels.find(x => x.name.indexOf("Community: ") != -1);

	var memberCount = client.guilds.first().memberCount;

	if (member) {
		member.setName("Community: " + memberCount);
	} else {
		client.guilds
			.first()
			.createChannel(
				"Community: " + client.guilds.first().memberCount,
				"voice",
				permissions
			)
			.then(x => {
				member = x;
				x.setParent(category);
			});
	}

	// var role = client.guilds
	// 	.first()
	// 	.channels.find(x => x.name.indexOf("┣●Role Count: ") != -1);

	// if (role) {
	// 	role.setName("┣●Role Count: " + client.guilds.first().roles.size);
	// } else {
	// 	client.guilds
	// 		.first()
	// 		.createChannel(
	// 			"┣●Role Count: " + client.guilds.first().roles.size,
	// 			"voice",
	// 			permissions
	// 		)
	// 		.then(x => {
	// 			role = x;
	// 			x.setParent(category);
	// 		});
	// }

	// var channel = client.guilds
	// 	.first()
	// 	.channels.find(x => x.name.indexOf("┣●Channel Count: ") != -1);

	// if (channel) {
	// 	channel.setName(
	// 		"┣●Channel Count: " + client.guilds.first().channels.size
	// 	);
	// } else {
	// 	client.guilds
	// 		.first()
	// 		.createChannel(
	// 			"┣●Channel Count: " + client.guilds.first().channels.size,
	// 			"voice",
	// 			permissions
	// 		)
	// 		.then(x => {
	// 			channel = x;
	// 			x.setParent(category);
	// 		});
	// }

	// var bots = 0;

	// client.guilds.first().members.forEach(e => {
	// 	if (e.user.bot == true) bots++;
	// });

	// bots = client.guilds.first().memberCount - bots;

	// var bot = client.guilds
	// 	.first()
	// 	.channels.find(x => x.name.indexOf("┗●Human Users: ") != -1);

	// if (bot) {
	// 	bot.setName("┗●Human Users: " + bots);
	// } else {
	// 	client.guilds
	// 		.first()
	// 		.createChannel("┗●Human Users: " + bots, "voice", permissions)
	// 		.then(x => {
	// 			bot = x;
	// 			x.setParent(category);
	// 		});
	// }

	// if (message) {
	// 	message.channel.send({
	// 		embed: {
	// 			author: {
	// 				name: "B8 stats",
	// 				icon_url:
	// 					"https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Yes_Check_Circle.svg/2000px-Yes_Check_Circle.svg.png"
	// 			},
	// 			color: 0x808080,
	// 			title: "Refreshed stats"
	// 		}
	// 	});
	// }
};

module.exports.help = {
	name: "stats",
	description: "Setup the server stats",
	help: "``setup``"
};
