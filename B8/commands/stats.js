//📊 Server Stats 📊

module.exports.run = async function(message, args, conf) {
	var permissions = [
		{
			allowed: 1049600,
			id: "566248340782841873"
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
		.channels.find(x => x.name.indexOf("◆ B8 Server Stats ◆") != -1);

	if (category) {
	} else {
		client.guilds
			.first()
			.createChannel("◆ B8 Server Stats ◆", "category", permissions)
			.then(x => {
				category = x;
				x.setPosition(0, false);
			});
	}

	client.guilds.first().fetchMembers();

	var member = client.guilds
		.first()
		.channels.find(x => x.name.indexOf("┏●Total Users: ") != -1);

	if (member) {
		member.setName("┏●Total Users: " + client.guilds.first().memberCount);
	} else {
		client.guilds
			.first()
			.createChannel(
				"┏●Total Users: " + client.guilds.first().memberCount,
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

	var bots = 0;

	client.guilds.first().members.forEach(e => {
		if (e.user.bot == true) bots++;
	});

	bots = client.guilds.first().memberCount - bots;

	var bot = client.guilds
		.first()
		.channels.find(x => x.name.indexOf("┗●Human Users: ") != -1);

	if (bot) {
		bot.setName("┗●Human Users: " + bots);
	} else {
		client.guilds
			.first()
			.createChannel("┗●Human Users: " + bots, "voice", permissions)
			.then(x => {
				bot = x;
				x.setParent(category);
			});
	}
	if (message) {
		message.channel.send({
			embed: {
				author: {
					name: "B8 stats",
					icon_url:
						"https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Yes_Check_Circle.svg/2000px-Yes_Check_Circle.svg.png"
				},
				color: 0x0000ff,
				title: "Refreshed stats"
			}
		});
	}
};

module.exports.help = {
	name: "stats",
	description: "Setup the server stats",
	help: "``setup``"
};
