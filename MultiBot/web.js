var CryptoJS = require("crypto-js");
var express = require("express");
var request = require("request");
var cookieParser = require("cookie-parser");
var sessionSecret = "REDACTED";
var oAuth2 = new oAuth();

module.exports.init = () => {
	var app = express();
	var port = 2003;

	app.use(cookieParser());

	var basepath = "/api/";

	function s(req, res) {
		if (req.cookies.data == undefined) {
			var user = new User();
			sData(res, user);
		} else {
			var user = gData(req);
		}

		return user;
	}

	app.get(basepath + "user", (req, res) => {
		var user = s(req, res);
		res.send(JSON.stringify(user));
		app.get(basepath + "user/test", (req, res) => {
			var user = s(req, res);

			if (user.token.access_token == "") return false;

			if (user.token.expires_in + user.token.lastRequested > new Date().getTime()) {
				return true;
			} else {
			}

			res.send(JSON.stringify(user));
		});
	});

	app.get(basepath + "login", (req, res) => {
		var user = s(req, res);
		user.token.code = req.param("code");

		console.log(user.code);

		if (user == false) return res.send("Invalid User");
		if (user.token.code == undefined) return res.send("Invalid Code");

		oAuth2.requestToken(user, (body) => {
			if (body.error != undefined) {
				res.send(JSON.stringify(body));
			} else {
				user.token.access_token = body.access_token;
				user.token.token_type = body.token_type;
				user.token.expires_in = body.expires_in;
				user.token.refresh_token = body.refresh_token;
				user.token.lastRequested = new Date().getTime();

				res.cookie(user);
				sData(res, user);
				res.send(JSON.stringify(user));
			}
		});
	});

	app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};

function oAuth() {
	this.tokenUrl = "https://discordapp.com/api/oauth2/token";
	this.apiUrl = "https://discordapp.com/api/v6/";
	this.client_id = "568379835416707072";
	this.scope = "identify%20guilds";
	this.client_secret = "REDACTED";
	this.redirect_uri = "http://localhost:2003/api/login";

	this.requestToken = function (user, callback) {
		request.post(
			this.tokenUrl,
			{
				form: {
					client_id: this.client_id,
					client_secret: this.client_secret,
					grant_type: "authorization_code",
					code: user.token.code,
					redirect_uri: this.redirect_uri,
					scope: this.scope,
				},
			},
			(err, http, body) => {
				callback(JSON.parse(body));
			}
		);
	};
}

function User() {
	this.token = {
		code: "",
		access_token: "",
		token_type: "",
		refresh_token: "",
		expires_in: 0,
		lastRequested: 0,
	};
}

function gData(req) {
	if (req.cookies.data == undefined) return false;

	return JSON.parse(CryptoJS.AES.decrypt(req.cookies.data, sessionSecret).toString(CryptoJS.enc.Utf8));
}

function sData(res, data) {
	var data = CryptoJS.AES.encrypt(JSON.stringify(data), sessionSecret).toString();

	res.cookie("data", data);

	return true;
}
