module.exports.run = async function(message, args, conf) {
	if (message.member.hasPermission(8192)) {
		async function clear() {
			console.log("clear");
			var fetched = await message.channel.fetchMessages({ limit: 100 });

			fetched = fetched.filter(
				x =>
					x.author.bot == true ||
					x.content.startsWith("!") ||
					x.content.startsWith("-") ||
					x.content.startsWith("?") ||
					x.content.startsWith("-m")
			);

			message.channel.bulkDelete(fetched).then(() => {
				if (fetched.size > 0) {
					clear();
				}
			});
		}
		clear();
	} else {
		message.channel.send({
			embed: {
				color: 16777215,
				author: {
					name: ln[data[conf].ln].Interface.noPermissionCommand
				}
			}
		});
	}
};

module.exports.help = {
	name: "clean",
	help: "``clean [channel]``"
};