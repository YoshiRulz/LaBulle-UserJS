// ==UserScript==
// @name         LaBulle
// @namespace    https://yoshirulz.github.io
// @version      0.2.1
// @description  Prevent (some of) others' stupidity from reaching and memetically infecting you.
// @author       YoshiRulz
// @match        */*
// @grant        none
// ==/UserScript==

(function() {
	"use strict";

	window.replInRawDOM = function(e, find, findRaw, repl) {
		e.innerHTML = e.innerHTML.replace(find,
			"<span class='labulle-corrected' title='orig.:" + (findRaw.length > 73 ? "\n" : " ") + findRaw + "'>" +
			repl + "</span>");
	};

	window.runLaBulle = function() {
		console.log("[LaBulle] Beginning text correction for this page.");

		document.head.appendChild([document.createElement("style")].map(function(e) {
				e.id = "labulle-stylesheet";
				e.innerHTML = ".labulle-corrected {\n\ttext-decoration: #BFFFDF underline wavy;\n\ttext-shadow: #DFFFEF 0 0 0.25em;\n}";
				return e;
			})[0]);

		let amendedElems;
		let precheckBodyText = false;
		switch (location.host) {
			case "reddit.com":
				amendedElems = Array.from(document.getElementsByClassName("entry"))
					.map(e => Array.from(e.children).filter(e => e.tagName === "FORM")).reduce((a, b) => a.concat(b))
					.map(e => e.children[1].firstElementChild).map(e => Array.from(e.children))
					.reduce((a, b) => a.concat(b));
				break;
			case "youtube.com":
				amendedElems = Array.from(document.getElementsByTagName("yt-formatted-string"))
					.filter(e => e.classList.contains("ytd-comment-renderer"));
				break;
			default:
				amendedElems = [];
				for (let tagName of ["a", "p", "span"])
					amendedElems = amendedElems.concat(Array.from(document.getElementsByTagName(tagName)));
				precheckBodyText = true;
		}

		//TODO decapitalization

		let replacements = [ // RegEx special characters must be escaped
			["could of", "could've"],
			["could care less", "couldn't care less"],
			["thankyou", "thank you"]
		];
		for (let i in replacements) replacements[i].unshift(new RegExp(replacements[i][0], "g"));
		for (let repl of replacements) {
			if (precheckBodyText) {
				if (document.body.innerText.includes(repl[1])) for (let e of amendedElems)
					if (e.innerHTML.includes(repl[1])) window.replInRawDOM(e, repl[0], repl[1], repl[2]);
			} else {
				for (let e of amendedElems)
					if (e.innerHTML.includes(repl[1])) window.replInRawDOM(e, repl[0], repl[1], repl[2]);
			}
		}
	};

	let createLaBulleStartTimeoutFunction = (interval, elseFunc) => function() {setTimeout(
			function() {if (document.readyState === "complete") window.runLaBulle(); else elseFunc();},
		interval);};
	createLaBulleStartTimeoutFunction(100,
		createLaBulleStartTimeoutFunction(500,
			createLaBulleStartTimeoutFunction(1000,
				createLaBulleStartTimeoutFunction(5000,
					createLaBulleStartTimeoutFunction(10000,
						createLaBulleStartTimeoutFunction(20000,
							function() {console.log("[LaBulle] Page not in \"complete\" ready state after ~35 seconds, aborting text correction for this page (call `window.runLaBulle()` to run).");}
	))))))();
})();
