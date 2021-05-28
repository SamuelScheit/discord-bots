$.get({
	url: "config",
	success: function(e) {
		e = JSON.parse(e);
		console.log(e);

		var text = "";

		var config = e.slice(0, 1)[0];
		e = e.slice(1);
		config.forEach(x => {
			if (e.find(y => y.id == x.id) != undefined) {
				e.find(y => y.id == x.id).active = true;
				e.find(y => y.id == x.id).channel = x.channel;
			}
		});

		e.sort((a, b) => {
			if (a.active == true) {
				return -1;
			}
			if (b.active == true) {
				return 1;
			} else {
				return 0;
			}
		});

		e.forEach(el => {
			var channels = "";
			var conf = config.find(x => x.id == el.id);
			if (conf == undefined) {
				conf = { frequency: "1" };
			}

			el.channels.sort((a, b) => {
				if (a.position > b.position) {
					return 1;
				}
				if (a.position < b.position) {
					return -1;
				} else {
					return 0;
				}
			});

			// el.channels = el.channels.filter(x => x.name.indexOf("partner") != -1);

			el.channels.forEach(x => {
				var t = "";
				if (el.channel == x.id) {
					t = "selected";
				}
				channels +=
					"<option " +
					t +
					" value='" +
					x.id +
					"'>" +
					x.name +
					"</option>";
			});

			el.iconURL =
				"https://cdn.discordapp.com/icons/" +
				el.id +
				"/" +
				el.icon +
				".png?size=1024";

			if (el.active == true) {
				el.active = "bg-success";
			} else {
				// el.active = "";
			}

			var f = parseInt(conf.frequency);

			text +=
				"<tr id='" +
				el.id +
				"'>" +
				"<td class='" +
				el.active +
				"'>" +
				"<img height='128' src='" +
				el.iconURL +
				"'>" +
				"</td>" +
				"<td>" +
				el.name +
				"</td>" +
				"<td>" +
				"<select class='browser-default custom-select'>" +
				channels +
				"</select>" +
				"<div onclick='update(this, \"set\")' class='btn btn-success btn-floating'>" +
				"<i class='fas fa-check'></i>" +
				"</div>" +
				"<div onclick='update(this, \"delete\")' class='btn btn-danger btn-floating'>" +
				"<i class='fas fa-times'></i>" +
				"</div>" +
				"</td>" +
				"<td>" +
				"<select class='browser-default custom-select'>" +
				"<option " +
				(f == 1 ? "selected" : "") +
				" value='1'>jeden Tag</option><option " +
				(f == 2 ? "selected" : "") +
				" value='2'>Jeden 2. Tag</option><option " +
				(f == 3 ? "selected" : "") +
				" value='3'>Jeden 3. Tag</option><option " +
				(f == 4 ? "selected" : "") +
				" value='4'>Jeden 4. Tag</option><option " +
				(f == 5 ? "selected" : "") +
				" value='5'>Jeden 5. Tag</option><option " +
				(f == 6 ? "selected" : "") +
				" value='6'>Jeden 6. Tag</option><option " +
				(f == 7 ? "selected" : "") +
				" value='7'>Jede Woche</option>" +
				"</select>" +
				"</td>" +
				"</tr>";
		});

		$("#servers").html(text);
		$("#serversTable").DataTable({
			paging: false,
			columnDefs: [{ targets: [0, 2, 3], searchable: false }]
		});
	}
});

function update(clan, method) {
	var id = $(clan).parents()[1].id;
	var channel = $(clan)
		.parents()
		.eq(1)
		.children()
		.eq(2)
		.find("select")
		.val();
	var frequency = $(clan)
		.parents()
		.eq(1)
		.children()
		.eq(3)
		.find("select")
		.val();

	if (method == "set") {
		$(clan)
			.parents()
			.eq(1)
			.children()
			.eq(0)
			.addClass("bg-success");
		$.get({
			url: "config/" + id + "/" + channel + "/" + frequency,
			timeout: 1000
		});
	} else if (method == "delete") {
		$(clan)
			.parents()
			.eq(1)
			.children()
			.eq(0)
			.removeClass("bg-success");
		$.post({
			url: "config/" + id,
			timeout: 1000
		});
	}
}
