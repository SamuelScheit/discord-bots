var Discord = require("discord.js");
global.client = new Discord.Client();

try {
	global.reset = function (g) {
		g.roles.array().forEach((x) => x.delete().catch((e) => {}));
		g.channels.array().forEach((x) => x.delete().catch((e) => {}));
	};

	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);
		client.on("message", (msg) => {
			if (msg.channel.type == "text") {
				if (msg.content == "!setupasdasdasdasd") {
					reset(msg.guild);
					msg.guild.createRole({
						name: "👑Leader👑",
						color: "GREEN",
						permissions: 8,
					});
					msg.guild.createRole({
						name: "💎Management💎",
						color: "LUMINOUS_VIVID_PINK",
						permissions: 2146958833,
					});
					msg.guild.createRole({
						name: "🌟Supporter🌟",
						color: 0xff00e6,
						permissions: 536345921,
					});

					msg.guild.createRole({
						name: "⚡️Tester⚡️",
						color: 0x00a5ff,
						permissions: 133684545,
					});
					msg.guild.createRole({
						name: "🏆Rotation Host🏆",
						color: "DARK_AQUA",
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🌀Designer🌀",
						color: "DARK_AQUA",
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "⚡️" + msg.guild.name + " - Legend⚡️",
						color: 0xca2222,
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "⚡️" + msg.guild.name + " - Champion⚡️",
						color: 0xca2222,
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "⚡️" + msg.guild.name + " - Pro⚡️",
						color: 0xca2222,
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "⚡️" + msg.guild.name + " - Member⚡️",
						color: 0xca2222,
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🏆Rotation - Legend🏆",
						color: "LUMINOUS_VIVID_PINK",
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🏆Rotation - Champion🏆",
						color: "LUMINOUS_VIVID_PINK",
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🏆Rotation - Pro🏆",
						color: "LUMINOUS_VIVID_PINK",
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🏆Rotation - Member🏆",
						color: "LUMINOUS_VIVID_PINK",
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🖥️Engineer🖥️",
						color: "PURPLE",
						permissions: 8,
					});
					msg.guild.createRole({
						name: "👍Applicant👍",
						color: "DARK_GOLD",
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🏆Tournament Winner🏆",
						color: 0x07b5ff,
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "👊Partner👊",
						color: 0x9a1db6,
						permissions: 104193089,
					});
					msg.guild.createRole({
						name: "⚔️Community⚔️",
						color: 0xffffff,
						permissions: 104324161,
					});
					msg.guild.createRole({
						name: "🤖Bot🤖",
						color: 0x000000,
						permissions: 8,
					});

					msg.guild.createChannel("📜Infos📜", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔👋welcome", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠📝news", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠💻platform", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠📱Social Media", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╚❗rules", "text").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("💬General💬", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔💬lobby", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠👀Player search", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠❓question-answered", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠📜Apply", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠💸daily-shop", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🏆stats", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🎬clips", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🏆win-screenshot", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╚🔧fortnite-patches", "text").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("💎Management💎", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔📝chat", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╚📝news", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╔💎Meeting💎", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠💎Team Meeting #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠💎Team Meeting #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚👑Leader Talk👑", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("🔥Chill Lounge🔥", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔🔊Music", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Chill Lounge #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Chill Lounge #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚🔥Chill Lounge #3", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("🏆Rotation Games🏆", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔🏆ankündigungen", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🏆leaderboard", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🏆Rotation Games #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🏆Rotation Games #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚🏆Rotation Games #3", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("⭐Support⭐", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔ ⚙ Waiting for Support", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠💎Support #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠💎Support #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚✅Finish with Support", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("⚡Test Lounge⚡", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔ ⚙ Waiting for Testing", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠⚡Test #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠⚡Test #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚✅Finish mit Test", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("👊Partner", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔👊partner", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╠👌small-partner", "text").then((y) => y.setParent(x));
						msg.guild.createChannel("╚👊requirement-partner", "text").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("🔥Duo Lounge🔥", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔🔥Duo Lounge #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Duo Lounge #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Duo Lounge #3", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚🔥Duo Lounge #4", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("🔥Trio Lounge🔥", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔🔥Trio Lounge #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Trio Lounge #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Trio Lounge #3", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚🔥Trio Lounge #4", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("🔥Squad Lounge🔥", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("╔🔥Squad Lounge #1", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Squad Lounge #2", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╠🔥Squad Lounge #3", "voice").then((y) => y.setParent(x));
						msg.guild.createChannel("╚🔥Squad Lounge #4", "voice").then((y) => y.setParent(x));
					});

					msg.guild.createChannel("💤AFK 😴", "category").then((x) => {
						x = x.id;
						msg.guild.createChannel("💤AFK 😴", "voice").then((y) => y.setParent(x));
					});
				}
			}
		});

		client.on("guildCreate", (guild) => {
			console.log(guild);
			var channel;
			if (guild.systemChannel == null) {
				channel = guild.channels.array().find((x) => x.type == "text");
			} else {
				channel = guild.systemChannel;
			}

			channel.send({
				embed: {
					color: 0x00ff00,
					author: {
						name: "Setup Bot",
						icon_url: client.user.avatarURL,
					},
					title: "Hey! I'm helping you to setup your Discord Server!",
					description: "To get started type : ```!setup```",
				},
			});
		});
	});

	client.login(process.env.TOKEN);
} catch (e) {
	console.error(e);
}

// https://discordapp.com/oauth2/authorize?client_id=562314179483140097&permissions=2146958847&scope=bot
// bzh655
