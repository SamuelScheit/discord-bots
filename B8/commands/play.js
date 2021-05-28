global.queue = new Map();

module.exports.run = async (msg, args) => {
	const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
	const searchString = args.join(" ");
	const serverQueue = queue.get(msg.guild.id);

	console.log("standard play command ");
	const voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel)
		return send(
			msg.channel,
			"error",
			"Play",
			"I'm sorry but you need to be in a voice channel to play music!"
		);

	const permissions = voiceChannel.permissionsFor(msg.client.user);
	if (!permissions.has("CONNECT")) {
		return send(
			msg.channel,
			"error",
			"Play",
			"I cannot connect to your voice channel, make sure I have the proper permissions!"
		);
	}
	if (!permissions.has("SPEAK")) {
		return send(
			msg.channel,
			"error",
			"Play",
			"I cannot speak in this voice channel, make sure I have the proper permissions!"
		);
	}

	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
		const playlist = await youtube.getPlaylist(url);
		const videos = await playlist.getVideos();
		for (const video of Object.values(videos)) {
			const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
			await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
		}
		return send(
			msg.channel,
			"success",
			"Play",
			`✅ Song: **${playlist.title}** will play next!`
		);
	} else {
		try {
			var video = await youtube.getVideo(url);
		} catch (error) {
			try {
				var videos = await youtube.searchVideos(searchString, 10);
				const videoIndex = 1;
				var video = await youtube.getVideoByID(
					videos[videoIndex - 1].id
				);
			} catch (err) {
				console.error(err);
				return send(
					msg.channel,
					"error",
					"Play",
					"🆘 I could not obtain any search results."
				);
			}
		}
		return handleVideo(video, msg, voiceChannel);
	}
};

module.exports.help = {
	name: "play",
	help: "play\nplay [link, search]",
	description: "Plays music"
};

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 1,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return send(
				msg.channel,
				"error",
				"Play",
				`I could not join the voice channel: ${error}`
			);
		}
	} else {
		serverQueue.songs.push(song);
		serverQueue.connection.dispatcher.end("Skip");
		console.log(serverQueue.songs);
		if (playlist) return undefined;
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	console.log(serverQueue.songs[0]);

	const dispatcher = serverQueue.connection
		.playStream(ytdl(song.url))
		.on("end", reason => {
			serverQueue.songs.splice(0, 1);
			play(guild, serverQueue.songs[0]);
		})
		.on("error", error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	return send(
		serverQueue.textChannel,
		"",
		"Play",
		`🎶 Start playing: **${song.title}**`
	);
}
