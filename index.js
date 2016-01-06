#!/usr/bin/env node

var p = require('commander'),
	fs = require('fs'),
	ok = false;

p.version('1.0.0')
	.usage('json [options] path')
	.arguments('path')
	.option('-i <filename>', 'The file to read from (otherwise use STDIN)')
	.option('-p, --pretty-print', 'Print JSON results on multiple lines')
	.action(function (path) {
		ok = true;
		if (p.I)
			get(fs.readFileSync(p.I).toString(), path);
		else {
			var body = '';
			process.stdin.on('data', function (chunk) {
				body += chunk;
			});
			process.stdin.on('end', function () {
				get(body, process.argv[2]);
			});
		}
	}).parse(process.argv);

if (!ok) console.log('Type json -h for usage.');

function get(json, path) {
	// TODO: Do this properly and get rid of the `eval`.
	var result = eval('(' + JSON.stringify(JSON.parse(json)) + ')' + path.replace(/^([^\[])/, '.$1'));
	if (typeof result == 'object')
		console.log(p.prettyPrint
			? JSON.stringify(result, null, 2)
			: JSON.stringify(result));
	else console.log(result);
}