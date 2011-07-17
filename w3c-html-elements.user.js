// ==UserScript==
// @name           W3C HTML Elements
// @namespace      https://github.com/skratchdot/w3c-html-elements.user.js
// @description    A user script to display additional information for each html element listed on the W3C elements page.
// @include        http://www.w3.org/TR/html-markup/elements.html
// ==/UserScript==

/*
 * To make this script work in Firefox, Chrome, and Opera, I am using
 * script injection inspired by:
 *     http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script
 * 
 * Relying on functionality from the following scripts/libraries:
 *   jQuery: http://www.jquery.com/
 */

function main() {
	$(document).ready(function() {

		// Create HTML snippet at the top of the page
		$('body').prepend('' +
			'<div id="userscript_container" style="background:#eee;width:100%">' +
			'	<div style="float:right"><a id="userscript_close" href="/">close</a></div>' +
			'	<div style="clear:both;float:none;margin:0 auto;width:260px;">' +
			'		<form id="userscript_form">' +
			'			<table width="100%">' +
			'				<tbody>' +
			'					<tr><td align="right">Label:</td><td><input id="userscript_label" type="text" value="Tag Omission" /></td></tr>' +
			'					<tr><td align="right">Selector:</td><td><input id="userscript_selector" type="text" value="div.tag-omission p" /></td></tr>' +
			'					<tr><td colspan="2"><input type="submit" value="CREATE TABLE" style="width:100%" /></td></tr>' +
			'				</tbody>' +
			'			</table>' +
			'		</form>' +
			'	</div>' +
			'	<div id="userscript_table"><br /></div>' +
			'</div>'
		);
		
		// When the close button is clicked, remove HTML snippet at the top of the page
		$('#userscript_close').click(function(e) {
			$('#userscript_container').slideUp();
			e.preventDefault();
		});
		
		// When the "Create Table" button is clicked
		$('#userscript_form').submit(function(e) {

			// Create Table
			$('#userscript_table').html('' +
				'<br />' +
				'<div id="userscript_showing">&nbsp;</div>' +
				'<br />' +
				'<table width="100%">' +
				'	<thead>' +
				'		<tr>' +
				'			<th>#</th>' +
				'			<th>Element</th>' +
				'			<th>Description</th>' +
				'			<th>' + $('#userscript_label').val() + '</th>' +
				'		</tr>' +
				'	</thead>' +
				'	<tbody></tbody>' +
				'</table>' +
				'<br />'
			);

			// Populate Table
			var list = $('div#elements div.toc ul li > a');
			var selector = $('#userscript_selector').val();
			var length = list.length;
			// Originally I was using: list.each(function(index) {});
			// but decided to loop through the list in reverse order
			// so the UI seems a little more responsive
			for (var i=1; i<=length; i++) {
				var item = $(list.get(length-i));
				var href = item.attr('href');
				var element = item.find('span.element').text();
				var shortdesc = item.find('span.shortdesc').text();

				// Update display so UI looks responsive
				$('#userscript_showing').text('Showing ' + i + ' of ' + length + ' elements.');

				// Get the 4th column via and ajax call, and add a new row to our table				
				$.ajax({
					url: href,
					success: function(result) {
						var content = '&nbsp;';
						try {
							content = $(result).find(selector).text();
						} catch(e) {}
						$('#userscript_table table tbody').prepend('' +
							'<tr>' +
							'	<td align="center">' + ( length - i + 1 ) + '</td>' +
							'	<td align="center"><a href="' + href + '">' + element + '</a></td>' +
							'	<td align="center">' + shortdesc + '</td>' +
							'	<td align="center">' + content + '</td>' +
							'</tr>'
						);
					},
					async: false
				});
			}
			e.preventDefault();
		});
	});
};

/* see: http://erikvold.com/blog/index.cfm/2010/6/14/using-jquery-with-a-user-script */
function jQueryInject(callback) {
	var script = document.createElement('script');
	script.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js');
	script.addEventListener('load', function() {
		var script = document.createElement('script');
		script.textContent = '(' + callback.toString() + ')();';
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
};
jQueryInject(main);