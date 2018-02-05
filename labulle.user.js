// ==UserScript==
// @name         LaBulle
// @namespace    https://yoshirulz.github.io
// @version      0.2
// @description  Prevent (some of) others' stupidity from reaching and memetically infecting you.
// @author       YoshiRulz
// @match        */*
// @grant        none
// ==/UserScript==

(function() {
	"use strict";

	window.runLaBulle = function() {
		console.log("[LaBulle] Beginning text correction for this page.");

		let temp = document.head.appendChild(document.createElement("style"));
		temp.id = "labulle-stylesheet";
		temp.innerHTML = ".labulle-corrected {\n\ttext-decoration: #BFFFDF underline wavy;\n\ttext-shadow: #DFFFEF 0 0 0.25em;\n}";

		let replInRawDOM = function(e, find, findRaw, repl) {
			e.innerHTML = e.innerHTML.replace(find,
				"<span class='labulle-corrected' title='orig.:" + (findRaw.length > 73 ? "\n" : " ") + findRaw + "'>" + repl + "</span>");
		};
		let amendedElems;
		let precheckBodyText = true;
		switch (location.host) {
			case "youtube.com":
				amendedElems = Array.from(document.getElementsByTagName("yt-formatted-string"))
					.filter(e => e.classList.contains("ytd-comment-renderer"));
				precheckBodyText = false;
				break;
			default:
				amendedElems = [];
				for (let tagName of ["a", "p", "span"])
					amendedElems = amendedElems.concat(Array.from(document.getElementsByTagName(tagName)));
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
					if (e.innerHTML.includes(repl[1])) replInRawDOM(e, repl[0], repl[1], repl[2]);
			} else {
				for (let e of amendedElems)
					if (e.innerHTML.includes(repl[1])) replInRawDOM(e, repl[0], repl[1], repl[2]);
			}
		}
	};

	let createLaBulleStartTimeoutFunction = function(timeout, elseFunc) {
		return function() {setTimeout(
				function() {
					if (document.readyState === "complete") window.runLaBulle(); else elseFunc();
				},
				timeout
			);};
	};
	createLaBulleStartTimeoutFunction(100,
			createLaBulleStartTimeoutFunction(1000,
				createLaBulleStartTimeoutFunction(10000,
					function() {console.log("[LaBulle] Page not in \"complete\" ready state after ~25 seconds, aborting text correction for this page. You can manually call the `window.runLaBulle()` function.");}
		)))();
})();
