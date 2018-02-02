// ==UserScript==
// @name         LaBulle
// @namespace    https://yoshirulz.github.io
// @version      0.1.1
// @description  Prevent (some of) others' stupidity from reaching and memetically infecting you.
// @author       YoshiRulz
// @match        */*
// @grant        none
// ==/UserScript==

(function() {
	"use strict";

	window.runLaBulle = function() {
		let temp = document.head.appendChild(document.createElement("style"));
		temp.id = "labulle-stylesheet";
		temp.innerHTML = ".labulle-corrected {\n\ttext-decoration: #BFFFDF underline wavy;\n\ttext-shadow: #DFFFEF 0 0 0.25em;\n}";
		let replInRawDOM = function(e, find, findRaw, repl) {
			e.innerHTML = e.innerHTML.replace(find,
				"<span class='labulle-corrected' title='orig.:" + (findRaw.length > 73 ? "\n" : " ") + findRaw + "'>" + repl + "</span>");
		};

		temp = [];
		for (let tagName of ["a", "p", "yt-formatted-string"]) temp = temp.concat(Array.from(document.getElementsByTagName(tagName)));
		//TODO decapitalization

		temp = [ // RegEx special characters must be escaped
			["could of", "could've"],
			["could care less", "couldn't care less"]
		];
		temp.map(a => [new RegExp(a[0], "g"), a[0], a[1]]);
		for (let repl of temp) if (document.body.innerText.includes(repl[0])) {
			let elems = [];
			for (let tagName of ["a", "p", "yt-formatted-string"]) elems = elems.concat(Array.from(document.getElementsByTagName(tagName)));
			let re = new RegExp(repl[0], "g");
			for (let e of elems) if (e.innerHTML.includes(repl[0])) replInRawDOM(e, repl[0], repl[1], repl[2]);
		}
	};

	setTimeout(function() { if (document.readyState === "complete") {
		window.runLaBulle();
	} else {
		setTimeout(function() { if (document.readyState === "complete") {
			window.runLaBulle();
		} else {
			setTimeout(function() { if (document.readyState === "complete") {
				window.runLaBulle();
			} else {
				console.log("[LaBulle] Page not in \"complete\" ready state after ~25 seconds, aborting text correction for this page.");
			}}, 20000);
		}}, 2000);
	}}, 200);
})();
