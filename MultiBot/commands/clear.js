module.exports.run = async function(message, args, conf) {
	setTimeout(() => {
		message.delete();
	}, 1500);
	switch (args[0]) {
		case undefined:
			message.channel.send({
				embed: {
					color: 0x0000ff,
					title: "Clear: Fehler! Hilfe:",
					description: this.help.help
				}
			});
			break;
		default:
			var error = false;
			var amount = parseInt(args[0]);

			if (amount > 100 && amount <= 10000) {
				for (var i = 0; i < amount / 100; i++) {
					message.channel.bulkDelete(100).catch(e => {
						error = true;
						message.channel.send({
							embed: {
								color: 0x0000ff,
								title: "Fehler beim löschen!",
								description: "Fehler: " + e.message
							}
						});
					});
				}
				if (error == false) {
					message.channel
						.send({
							embed: {
								color: 0x0000ff,
								title:
									"Clearing for you " +
									amount +
									" messages 😘"
							}
						})
						.then(msg => {
							setTimeout(() => {
								msg.delete();
							}, 1500);
						});
				}
			} else {
				if (amount > 10000) {
					message.channel.send({
						embed: {
							color: 0x0000ff,
							title: "Fehler beim löschen!",
							description:
								"Es können nicht mehr als 10000 Nachrichten gleichzeitig gelöscht werden!"
						}
					});
				} else {
					message.channel
						.bulkDelete(amount)
						.then(x => {
							if (error == false) {
								message.channel
									.send({
										embed: {
											color: 0x0000ff,
											title:
												"Cleared for you " +
												amount +
												" messages 😘"
										}
									})
									.then(msg => {
										setTimeout(() => {
											msg.delete();
										}, 1500);
									});
							}
						})
						.catch(e => {
							error = true;
							message.channel.send({
								embed: {
									color: 0x0000ff,
									title: "Fehler beim löschen!",
									description: "Fehler: " + e.message
								}
							});
						});
				}
			}
			break;
	}
};

module.exports.help = {
	name: "clear",
	description: "Clear messages in text Channel",
	help: "``clear [# of messages]``"
};
