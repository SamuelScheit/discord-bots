var serverId = "549014473101279243";

var ln;
var myLn;
var config;
var conf;
var event = {};
var url = "http://server:2004";

$.get({
	url: url + "/language",
	success: data => {
		ln = data;
		$.get({
			url: url + "/config",
			success: data => {
				config = data;
				conf = config.find(x => x.serverId == serverId);
				myLn = ln[conf.ln];
				language();
			}
		});
	}
});

function language() {
	$(".ln-language").html(myLn.Interface.language.name);
	$(".ln-language-description").html(myLn.Interface.language.description);

	$(".ln-prefix").html(myLn.Interface.prefix.name);
	$(".ln-prefix-description").html(myLn.Interface.prefix.description);

	$(".ln-language").html(myLn.Interface.language.name);
	$(".ln-language-description").html(myLn.Interface.language.description);

	$(".ln-notify").html(myLn.Interface.notify.name);
	$(".ln-notify-description").html(myLn.Interface.notify.description);

	$(".ln-events").html(myLn.Interface.events.name);
	$(".ln-events-description").html(myLn.Interface.events.description);

	$(".ln-cmd").html(myLn.Interface.cmd.name);
	$(".ln-cmd-description").html(myLn.Interface.cmd.description);

	$(".ln-back").html(myLn.Interface.back);
	languageSelection();
}

function languageSelection() {
	var text = "";

	Object.keys(myLn.language).forEach(function(i) {
		var e = myLn.language[i];
		if (i == myLn.thisLanguage.short) {
			text +=
				"<option value='" +
				i +
				"' selected data-subtext='" +
				ln[i].thisLanguage.name +
				"'>" +
				e.flag +
				" " +
				e.name +
				"</option>";
		} else {
			text +=
				"<option value='" +
				i +
				"' data-subtext='" +
				ln[i].thisLanguage.name +
				"'>" +
				e.flag +
				" " +
				e.name +
				"</option>";
		}
	});

	$("#languageSelect").html(text);
	$("#languageSelect").selectpicker();
}

$("#languageSelect").on("change", e => {
	conf.ln = $("#languageSelect").val();
	myLn = ln[conf.ln];
	language();
	$.get({
		url: url + "/config/" + serverId + "/ln/" + $("#languageSelect").val()
	});
});

$(function() {
	$(".mdb-select").materialSelect();
});

$("a[data-toggle=tab]").on("click", e => {
	$(e.currentTarget).removeClass("active");
});
