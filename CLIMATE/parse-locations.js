var _ = require('underscore');
var fs = require('fs');

var obsLocs = require('./observation-locations.json');
var locPrefix = "http://lab.environment.data.gov.au/data/acorn/climate/slice/station/";
var locations = {};


_.each(obsLocs.result.items, function(item){
	var id = item._about.replace(locPrefix, '');
	locations[id] = item;
});

writeFile(locations, 'locations.json');

function writeFile(data, path){
	var jsonOut = fs.createWriteStream(path);
	jsonOut.write(JSON.stringify(data));
	jsonOut.on('error', function(err) { console.log(err); });
	jsonOut.end();
	console.log("done!");
}

