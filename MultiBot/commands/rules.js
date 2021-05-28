module.exports.run = async function(message, args, conf) {
	var rules = [
		"§1 - Beleidigungen in in jeglicher Form sowie Mobbing ist strengstens verboten.",
		"§2 - Serverhoping ist untersagt.",
		"§3 - Benutzt bitte die Channel dessen benötigung ihr benötigt.",
		"§4 - Bitte keine Abstoßenden und Rassistischen Profilbilder verwenden.",
		"§5 - Spam von Emoji, Texten... ist untersagt.",
		"§6 - Werbung für Creator Code, Seiten und Links ist verboten.",
		"§7 - Das verkaufen oder tauschen von Accounts ist verboten.",
		"§8 - Das versenden von Rassistischen und Pornographischen Inhalten ist strengstens Untersagt.",
		"§9 - Teamitglieder müssen sich euch gegenüber nicht rechtfertigen."
	];
	client.guilds
		.first()
		.channels.array()
		.find(x => x.name.toLowerCase().indexOf("regeln") != -1)
		.fetchMessages({ limit: 100 })
		.then(x => {
			message.channel.send({
				embed: {
					color: 0x0000ff,
					title: "Regeln auf " + client.guilds.first().name + ":",
					thumbnail: client.user.avatarURL,
					description: x
				}
			});
		});
};

module.exports.help = {
	name: "rules",
	description: "Lists the Rules",
	help: "``rules``"
};
