module.exports.run = async (msg, args) => {
	var serverQueue = queue.get(msg.guild.id);

	console.log("standard stop command ", serverQueue);
	const voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel)
		return send(
			msg.channel,
			"error",
			"Stop",
			"I'm sorry but you need to be in a voice channel to stop music!"
		);

	serverQueue.song = null;

	serverQueue.voiceChannel.leave();

	send(msg.channel, "Success", "Stop", "Successfully stopped");
};

module.exports.help = {
	name: "stop",
	help: "stop",
	description: "Stops playing and leaves voice channel"
};
