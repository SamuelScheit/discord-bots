const config = require("./config.json");
const fs = require("fs");
const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const util = require("minecraft-server-util");
require("missing-native-js-functions");
const fetch = require("node-fetch");

let Servers = new Map();

async function server({ ip, channel_id, message_id }) {
	const channel = client.channels.resolve(channel_id);
	try {
		const response = await util.status(ip); // port is default 25565
		console.log(response.samplePlayers);
		let old = Servers.get(ip);
		if (!old) old = response.samplePlayers;
		const o = old.map((x) => x.name);
		const n = response.samplePlayers.map((x) => x.name);

		const joined = n.missing(o);
		const left = o.missing(n);

		for (const player of joined) {
			channel.send(`${player} joined`).then((x) => x.delete());
		}

		for (const player of left) {
			channel.send(`${player} left`).then((x) => x.delete());
		}

		if (left.length || joined.length) {
			await fetch(`https://discord.com/api/channels/${channel_id}/messages/${message_id}`, {
				method: "PATCH",
				headers: {
					authorization: `Bot ${client.token}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					content: `**${response.host}\nPlayers**: ${response.onlinePlayers}/${
						response.maxPlayers
					}\n\n${n.join("\n")}`,
				}),
			});
		}

		Servers.set(ip, response.samplePlayers);
	} catch (error) {
		console.error(error);
	}

	setTimeout(server.bind(null, { ip, channel_id, message_id }), 5000);
}

client.on("ready", () => {
	console.log(`${client.user.tag} is ready`);
	config.servers.forEach((x) => server(x));
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === "ping") {
		await interaction.reply({ ephemeral: true, content: "Ping to gateway: " + client.ws.ping });
	} else if (commandName === "setup") {
		const ip = interaction.options.getString("ip");
		const status = await util.status(ip);
		let message_id = "";
		try {
			await interaction.reply(`Minecraft Server status was setup for ${status.host}`);
			const message = await interaction.fetchReply();
			message_id = message.id;
			config.servers.push({ ip, channel_id: interaction.channelId, message_id });

			fs.writeFileSync(__dirname + "/config.json", JSON.stringify(config, null, "\t"), { encoding: "utf8" });
		} catch (error) {
			console.error(error);
			return await interaction.reply(`Error contating ${ip}`);
		}
		server({ ip, channel_id: interaction.channelId, message_id });
	}
});

client.login(config.token);
