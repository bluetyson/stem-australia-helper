var Converter = require("csvtojson").Converter;
var converter = new Converter({});
var fs = require('fs');
var _ = require('underscore');

//var raw = require('./../consumption-timseries2.json');
var raw = require('./../generation-series.json');

function parseCsv(){
	converter.fromFile("./ENERGY/generation-series.csv",function(err,result){
		console.log(result);

		writeFile(result, 'generation-series.json');

	});
}

function writeFile(data, path){
	var jsonOut = fs.createWriteStream(path);
	jsonOut.write(JSON.stringify(data));
	jsonOut.on('error', function(err) { console.log(err); });
	jsonOut.end();
	console.log("done!");
}

function formatJson(){

	var out = [];

	_.each(raw, function(r){

		var keys = _.keys(r);
		var row = {
			name: r[keys[0]],
			data: {}
		};

		_.each(keys, function(key, index){

			// ignore key 0
			if(index != 0){
				row.data[key] = r[keys[index]];
			}

			//
		});

		out.push(row);

	});

	writeFile(out, 'generation-series.json');

}

formatJson();
//parseCsv();