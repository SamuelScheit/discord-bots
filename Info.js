var Discord = require("discord.js");
global.client = new Discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

//
//
//
//
//
//
//
//
//
//
//
// client.guilds.forEach(guild => {
// 	console.log(
// 		"Server: ",
// 		guild.id + " " + guild.name + " " + guild.members.size
// 	);
// console.log(
// 	"roles: ",
// 	guild._sortedRoles.map(x => x.id + " " + x.name)
// );
// console.log(
// 	"channels: ",
// 	guild.channels.map(x => x.id + " " + x.name)
// );
// console.log(
// 	"members: ",
// 	guild.members.map(x => x.user.id + " " + x.user.username)
// );
// });

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
