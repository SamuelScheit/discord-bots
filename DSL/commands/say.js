module.exports.run = (message, args) => {
	message.channel.send(args.join(" "));
};
