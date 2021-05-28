var fs = require("fs");

module.exports.init = (Discord) => {
	var basic = require("./basic");
	var web = require("./web");
	var jsonfile = require("jsonfile");

	basic.init();
	web.init();

	setInterval((jsonfile) => {
		updateConfig(jsonfile);
	}, 1000 * 60 * 5, jsonfile);

	global.config = require(__dirname + "/config.json");

	client.commands = new Discord.Collection();
	fs.readdir(__dirname + "/commands/", {}, (err, file) => {
		if (err) console.error(err);

		var jsfile = file.filter(f => f.split(".").pop() === "js");

		if (jsfile.length <= 0) console.log("Couldn't find any commands");

		jsfile.forEach((f, i) => {
			let props = require(__dirname + "/commands/" + f);
			console.log(f + " loaded!");
			client.commands.set(props.help.name, props);
		});
	});

	client.extra = new Discord.Collection();
	fs.readdir(__dirname + "/commands/extra/", {}, (err, file) => {
		if (err) console.error(err);

		var jsfile = file.filter(f => f.split(".").pop() === "js");

		if (jsfile.length <= 0) console.log("Couldn't find any extra commands");

		jsfile.forEach((f, i) => {
			let props = require(__dirname + "/commands/extra/" + f);
			console.log(f + " loaded!");
			client.extra.set(f.replace(".js", ""), props);
		});
	});
}

var updateConfig = function (jsonfile) {
	jsonfile
		.writeFile(__dirname + "/config.json", config)
		.then(res => {
			console.log("Saved config");
		})
		.catch(error => console.error(error));
};