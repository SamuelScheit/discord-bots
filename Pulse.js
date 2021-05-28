var Discord = require("discord.js");
global.client = new Discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	global.server = client.guilds.array().find((x) => x.id == "533669007182659594");

	client.on("voiceStateUpdate", (oldMember, newMember) => {
		let newUserChannel = newMember.voiceChannel;
		let oldUserChannel = oldMember.voiceChannel;
		if (newMember.guild.id == "476431414460678165") {
			if (
				oldUserChannel == undefined ||
				(newUserChannel !== undefined && newUserChannel.id != oldUserChannel.id)
			) {
				client.guilds
					.first()
					.channels.filter((x) => x.id == "496699016562606105")
					.first()
					.send(
						"Hey <@" +
							newMember.user.id +
							">#" +
							newMember.user.discriminator +
							" ist in <#" +
							newUserChannel.id +
							"> gejoint"
					)
					.catch((err) => {
						console.error(err);
					});
			} else if (newUserChannel === undefined) {
				// User leaves a voice channel
			}
		}
	});
});

client.login(process.env.TOKEN);
