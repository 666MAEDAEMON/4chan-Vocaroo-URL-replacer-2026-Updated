/*
    4chan Vocaroo URL Replacer
    I aint copy writing shit, I just yoinked all this and updated it too work with new vocaroo links and embeds :3
	It probably isnt the best so enjoy :3

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name				4chan Vocaroo URL Replacer
// @namespace			http://maedaemon.bounceme.net/
// @id					Vocaroo@666MAEDAEMON
// @author				MAEDAE
// @description			Turns plaintext/linked Vocaroo URLs into embedded objects on 4chan, 7chan, 420chan, operatorchan, krautchan, 2chan and imageboard archives
// @version				3.0
// @copyright			2026 IDFC
// @license				GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @icon				https://raw.github.com/666MAEDAEMON/4chan-Vocaroo-URL-replacer-2026-Updated/master/icon.jpg
// @homepage			https://github.com/666MAEDAEMON/4chan-Vocaroo-URL-replacer-2026-Updated
// @supportURL			https://github.com/666MAEDAEMON/4chan-Vocaroo-URL-replacer-2026-Updated/issues
// @updateURL			https://userscripts.org/scripts/source/89348.meta.js
// @downloadURL			https://userscripts.org/scripts/source/89348.user.js
// @screenshot			https://raw.github.com/666MAEDAEMON/4chan-Vocaroo-URL-replacer-2026-Updated/master/screenshot.png
// @contributionURL		https://store.steampowered.com/wishlist/id/MAEDAEFAE/
// @contributionAmount	Steam games
// @priority			1
// @run-at				document-end
//
// @include				http://*.2chan.net/*
// @include				http*://boards.4chan.org/*
// @include				http*://dis.4chan.org/*
// @include				http://*.4chon.net/*
// @include				http*://7chan.org/*
// @include				http://boards.420chan.org/*
// @include				http://*.krautchan.net/*
// @include				http://*.operatorchan.org/*
// @include				http://chanarchive.org/*
// @include				http*://archive.foolz.us/*
// @include				http*://nsfw.foolz.us/*
// @include				http*://fuuka.warosu.org/*
// @include				http://archive.heinessen.com/*
// @include				http://archive.installgentoo.net/*
// @include				http*://archive.nyafuu.org/*
// @include				http*://rbt.asia/*
// @include				http://archive.thedarkcave.org/*
// @include				http://suptg.thisisnotatrueending.com/archive/*
//
// @match				http://*.2chan.net/*
// @match				http://7chan.org/*
// @match				https://7chan.org/*
// @match				http://boards.4chan.org/*
// @match				https://boards.4chan.org/*
// @match				http://dis.4chan.org/*
// @match				https://dis.4chan.org/*
// @match				http://*.4chon.net/*
// @match				http://boards.420chan.org/*
// @match				http://*.krautchan.net/*
// @match				http://*.operatorchan.org/*
// @match				http://chanarchive.org/*
// @match				http://archive.foolz.us/*
// @match				http://fuuka.warosu.org/*
// @match				https://fuuka.warosu.org/*
// @match				http://archive.heinessen.com/*
// @match				http://archive.installgentoo.net/*
// @match				http://archive.nyafuu.org/*
// @match				https://archive.nyafuu.org/*
// @match				http://rbt.asia/*
// @match				https://rbt.asia/*
// @match				http://archive.thedarkcave.org/*
// @match				http://suptg.thisisnotatrueending.com/archive/*
// ==/UserScript==

(function () {
	"use strict";
	var embedArray = new Array(0), embedCur = 0, embedTotal = 0, i, timeCheck, timeLastRun, re = {}, settings, sites = {}, siteArray;
	settings = {
		filter: {
			limitPer:		5,
			limitTotal:		-1,
			ignoreDupes:	true
		},
		embed: {
			brBefore:		false,
			brAfter:		false
		}
	};

    settings.embed.code =
    '<button class="vocaroo-load" data-vocaroo="$1">🎤 Load Vocaroo</button>';

    re.plaintext = /(?:https?:\/\/)?(?:www\.)?(?:vocaroo\.com|voca\.ro)\/([A-Za-z0-9]{10,})/gi;

    re.linked = /<a[^>]+href=["'](?:https?:\/\/)?(?:www\.)?(?:vocaroo\.com|voca\.ro)\/([A-Za-z0-9]{10,})["'][^>]*>.*?<\/a>/gi;

	sites.plaintextBQ	= [/(?:2chan\.net|boards\.4chan\.org|chanarchive\.org|krautchan\.net|suptg\.thisisnotatrueending\.com)/, 'tag', 'blockquote', re.plaintext];
	sites.linkedBQ		= [/(?:4chan\.org|archive\.installgentoo\.net|boards\.420chan\.org|fuuka\.warosu\.org|operatorchan\.org|rbt\.asia|archive\.nyafuu\.org|archive\.heinessen\.com)/, 'tag', 'blockquote', re.linked];
	sites.linkedBody	= [/(?:4chon\.net)/, 'class', 'body', re.linked];
	sites.linkedMessage	= [/(?:7chan\.org)/, 'class', 'message', re.linked];
	sites.linkedText	= [/(?:(?:archive|nsfw)\.foolz\.us|archive\.thedarkcave\.org)/, 'class', 'text', re.linked];

	for (i in sites) { if (sites.hasOwnProperty(i)) { if (sites[i][0].exec(document.domain)) { siteArray = sites[i]; break; } } }
	function embedPost(match, id) {
    var embedURL = id;

    embedTotal++;
    embedCur++;

    if ((embedArray.indexOf(embedURL) > -1) && (settings.filter.ignoreDupes)) {
        return '';
    }

    if (((settings.filter.limitPer < 0) || (embedCur <= settings.filter.limitPer)) &&
        ((settings.filter.limitTotal < 0) || (embedTotal <= settings.filter.limitTotal))) {

        embedArray.push(embedURL);

        return settings.embed.code.replace('$1', embedURL);
    }

    return match;
}

	function embed(n) {
		if ((typeof k == 'number') && n.target.nodeType !== 1) { return; }
		var l, posts, temp;
		if (siteArray[1] == 'tag') {
			posts = document.getElementsByTagName(siteArray[2]);
		} else {
			posts = document.getElementsByClassName(siteArray[2]);
		}
		for (l = 0; l < posts.length; l++) {
			embedCur = 0;
			embedArray.length = 0;
			temp = posts[l].innerHTML.replace(/<wbr>/g, '').replace(siteArray[3], embedPost);
			if (temp !== posts[l].innerHTML.replace(/<wbr>/g, '')) { posts[l].innerHTML = temp; }
		}
	}

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.target.closest && mutation.target.closest('.vocaroo-load')) {
                return;
            }
        }
        embed();
    });


    observer.observe(document.body, {
    childList: true,
    subtree: true
});

document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('vocaroo-load')) {
        return;
    }

    var id = e.target.dataset.vocaroo;

    var iframe = document.createElement('iframe');
    iframe.width = "300";
    iframe.height = "60";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay";
    iframe.src = "https://vocaroo.com/embed/" + id + "?autoplay=0";

    e.target.replaceWith(iframe);
});

}());
