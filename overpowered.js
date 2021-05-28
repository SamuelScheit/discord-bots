var Discord = require("discord.js");
global.client = new Discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.guilds
		.first()
		.channels.get("563385873291542578")
		.send(
			"Verfügung, mit dem sich Freunde des natürlichen Bodenbelags bereits vor der Verlegung beziehungsweise Renovierung einen Eindruck darüber verschaffen können, welche Holzart und welches Verlegemuster am besten in die Räumlichkeiten passt. Berücksichtigt werden neben der Parkett-, Holz- und Verlegeart auch die Verlegerichtung sowie die Wandfarbe. Der Raumdesigner zeigt automatisch an, welche Zusammenstellungen möglich sind. Zur Auswahl stehen zahlreiche Szenarien typischer Wohnräume, anhand derer man die unterschiedlichen Kombinationen von Farbe, Oberfläche, Muster und Holzart beliebig oft durchspielen kann. Zum anderen hat der zukünftige Besitzer eines Bembé-Parketts auch die Möglichkeit, sein eigenes Foto hochzuladen oder\nBembé\nLangversion: 2.232 (mit Leerzeichen)\nRaumdesigner erlaubt Blick in die Zukunft\nWirkung von Parkettböden im eigenen Zuhause im Vorfeld ausprobieren\n(epr) „Wer nicht wagt, der nicht gewinnt“ sagt ein altes Sprichwort. In vielen Situationen ist es sicher sinnvoll, einfach mal ins kalte Wasser zu springen oder etwas auszuprobieren, ohne die genauen Folgen zu kennen. Doch es gibt auch Investitionen, bei denen es besser ist, vorher genau zu wissen, auf was man sich einlässt. Wer beispielsweise ein Haus baut oder saniert, sollte sich die Auswahl der Baustoffe und des Bodenbelags sowie die Raumaufteilung im Vorfeld gut überlegen, denn viele Maßnahmen sind nicht einfach rückgängig zu machen. Doch woher weiß der Bauherr, was seinem Eigenheim gut steht?\nBei der Innengestaltung der eigenen vier Wände gibt es inzwischen einfache Möglichkeiten, einen Blick in die Zukunft zu werfen: Raumdesigner und Konfiguratoren erlauben bereits vor der Kaufentscheidung einen realitätsnahen Eindruck davon, wie gewählte Materialien, Farben und Einrichtungsgegenstände im Endergebnis aussehen werden. Bembé Parkett stellt seinen Kunden seit Beginn des Jahres einen Parkett-Raumdesigner zur Verfügung"
		);
	setInterval(function () {
		if (new Date().getHours() > 22 && new Date().getHours() < 7) {
		} else {
			setTimeout(() => {
				client.guilds
					.first()
					.channels.get("563385873291542578")
					.send(
						"Verfügung, mit dem sich Freunde des natürlichen Bodenbelags bereits vor der Verlegung beziehungsweise Renovierung einen Eindruck darüber verschaffen können, welche Holzart und welches Verlegemuster am besten in die Räumlichkeiten passt. Berücksichtigt werden neben der Parkett-, Holz- und Verlegeart auch die Verlegerichtung sowie die Wandfarbe. Der Raumdesigner zeigt automatisch an, welche Zusammenstellungen möglich sind. Zur Auswahl stehen zahlreiche Szenarien typischer Wohnräume, anhand derer man die unterschiedlichen Kombinationen von Farbe, Oberfläche, Muster und Holzart beliebig oft durchspielen kann. Zum anderen hat der zukünftige Besitzer eines Bembé-Parketts auch die Möglichkeit, sein eigenes Foto hochzuladen oder\nBembé\nLangversion: 2.232 (mit Leerzeichen)\nRaumdesigner erlaubt Blick in die Zukunft\nWirkung von Parkettböden im eigenen Zuhause im Vorfeld ausprobieren\n(epr) „Wer nicht wagt, der nicht gewinnt“ sagt ein altes Sprichwort. In vielen Situationen ist es sicher sinnvoll, einfach mal ins kalte Wasser zu springen oder etwas auszuprobieren, ohne die genauen Folgen zu kennen. Doch es gibt auch Investitionen, bei denen es besser ist, vorher genau zu wissen, auf was man sich einlässt. Wer beispielsweise ein Haus baut oder saniert, sollte sich die Auswahl der Baustoffe und des Bodenbelags sowie die Raumaufteilung im Vorfeld gut überlegen, denn viele Maßnahmen sind nicht einfach rückgängig zu machen. Doch woher weiß der Bauherr, was seinem Eigenheim gut steht?\nBei der Innengestaltung der eigenen vier Wände gibt es inzwischen einfache Möglichkeiten, einen Blick in die Zukunft zu werfen: Raumdesigner und Konfiguratoren erlauben bereits vor der Kaufentscheidung einen realitätsnahen Eindruck davon, wie gewählte Materialien, Farben und Einrichtungsgegenstände im Endergebnis aussehen werden. Bembé Parkett stellt seinen Kunden seit Beginn des Jahres einen Parkett-Raumdesigner zur Verfügung"
					);
			}, Math.random() * 1000 * 60 * 7);
		}
	}, 1000 * 60 * 15);
});

client.login(process.env.TOKEN);
