module.exports.run = async function (message, args, conf) {
	message.channel.send({
		embed: {
			color: 0x0000ff,
			title: "Unsere Social Media Accounts:",
			thumbnail: { url: client.user.avatarURL },
			fields: [
				{
					name:
						"**Folge uns auf Instagram um nichts mehr zu verpassen!**",
					value: "https://www.instagram.com/b8.esports/"
				},
				{
					name: "**Abonniere uns auf YouTube!**",
					value:
						"https://www.youtube.com/channel/UCbO2Zna_Vpm7mfcbgnPeBpw"
				}
			]
		}
	});
};

module.exports.help = {
	name: "social-media",
	description: "Lists the Social Media",
	help: "``social-media``"
};
