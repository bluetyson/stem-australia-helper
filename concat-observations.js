var _ = require('underscore');
var fs = require('fs');


var count = 112;

var locations = [];

for(var i = 1; i < count + 1; i++){
	var station = require('./json/'+i+'.json');
	locations = locations.concat(station);
}

writeFile(locations, 'stations.json');

function writeFile(data, path){
	var jsonOut = fs.createWriteStream(path);
	jsonOut.write(JSON.stringify(data));
	jsonOut.on('error', function(err) { console.log(err); });
	jsonOut.end();
	console.log("done!");
}

