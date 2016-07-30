var _ = require('underscore');
var fs = require('fs');
//var parser = require('xml2json');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var locations = require('./locations.json');
var locPrefix = "http://lab.environment.data.gov.au/data/acorn/climate/slice/station/";

var count = 112;

function parseFile(index){

	console.log('parseFile '+index);
	if(index >= count +1) return;

	fs.readFile('./raw/observations_part'+index+'.xml', function(err, data) {

		parser.parseString(data, function (err, result) {

			console.log('parsed '+index);
			var obs = result["rdf:RDF"]['rdf:Description'];

			var attrs = {};
			_.each(obs, function(ob){

				var year = ob["acorn-sat:year"][0];

				if(attrs.hasOwnProperty(year)){
					attrs[year].push({
						min: ob["acorn-sat:minTemperature"][0]['_'] ? parseFloat(ob["acorn-sat:minTemperature"][0]['_']) : null,
						max: ob["acorn-sat:maxTemperature"][0]['_'] ? parseFloat(ob["acorn-sat:maxTemperature"][0]['_']) : null,
						station: locations[ob["acorn-sat:timeSeries"][0]['$']['rdf:resource'].replace(locPrefix, '')],
						day: parseInt(ob["acorn-sat:day"][0]),
						month: parseInt(ob["acorn-sat:month"][0]),
						year: parseInt(year)
					});

				}
				else {
					attrs[year] = [{
						min: ob["acorn-sat:minTemperature"][0]['_'] ? parseFloat(ob["acorn-sat:minTemperature"][0]['_']) : null,
						max: ob["acorn-sat:maxTemperature"][0]['_'] ? parseFloat(ob["acorn-sat:maxTemperature"][0]['_']) : null,
						station: locations[ob["acorn-sat:timeSeries"][0]['$']['rdf:resource'].replace(locPrefix, '')],
						day: parseInt(ob["acorn-sat:day"][0]),
						month: parseInt(ob["acorn-sat:month"][0]),
						year: parseInt(year)
					}];
				}

			});

			// calc a mean for each year
			var results = [];

			_.each(_.keys(attrs), function(key){

				results.push({
					station: attrs[key][0].station,
					year: key,
					min: arrayMean(_.map(attrs[key], function(ob){
						return ob.min;
					})),
					max: arrayMean(_.map(attrs[key], function(ob){
						return ob.max;
					}))
				})

			});

			writeFile(results, 'json/'+index+'.json');
			parseFile(index + 1);
		});
	});
}


parseFile(1);

function arrayMean(arr){
	var sum = 0;
	_.each(arr, function(a){
		sum += a;
	});
	return sum / arr.length;
}


function writeFile(data, path){
	var jsonOut = fs.createWriteStream(path);
	jsonOut.write(JSON.stringify(data));
	jsonOut.on('error', function(err) { console.log(err); });
	jsonOut.end();
	console.log("done!");
}

