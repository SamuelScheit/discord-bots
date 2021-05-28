module.exports.run = async (msg, args) => {
	const serverQueue = queue.get(msg.guild.id);

	console.log("standard skip command ", serverQueue);
	const voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel)
		return send(
			msg.channel,
			"error",
			"Skip",
			"I'm sorry but you need to be in a voice channel to skip music!"
		);

	if (!serverQueue || !serverQueue.song)
		return send(
			msg.channel,
			"error",
			"Skip",
			"There is nothing playing that I could skip for you."
		);

	serverQueue.connection.dispatcher.end("Skip command has been used!");
	send(msg.channel, "Success", "Skip", "Successfully skipped song");
};

module.exports.help = {
	name: "skip",
	help: "skip",
	description: "Skips the current song"
};
