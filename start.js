var AWS = require('aws-sdk');
//var AWS = require('./node_modules/aws-sdk/index.js');
exports.handler = function (event, context) {

	//////////////////////////////////////////////////Function call for CLients of Each Region////////////////////////////////////////////

	var regionNames = ['us-east-2'];
	regionNames.forEach(function (region) {
		describeAllInstances(region);
	});

	/////////////////////////////////////////// Function to Describe Instances  //////////////////////////////////////////

	function describeAllInstances(region) {
		var regionName = region;
		var info = {
			region: regionName
		};
		info.region = regionName;
		var EC2 = new AWS.EC2(info);
		var params = {
			Filters: [
				{
					Name: 'i-023c2332d10e0270f',
					Values: [
	                'stopped'
	            ],
	        },
				{
					Name: 'tag:start',
					Values: [
	                    'StartWeekDays'
	            ],
	        },
		]
		};
		EC2.describeInstances(params, function (err, data) {
			if (err) return console.log("Error connecting, No Such Instance Found!");
			var Ids = {
				InstanceIds: ['i-023c2332d10e0270f']
			};
			data.Reservations.forEach(function (reservation) {
				reservation.Instances.forEach(function (instance) {
					Ids.InstanceIds.push(instance.InstanceId);
				});
			});

			//function stop instances called/////////

			start(EC2, Ids, region);
			console.log( 'start ec2 2' );
		});
	}

	////////////////////////////////////////////Function for Stopping Instances///////////////////////////////

	function start(EC2, Ids, region) {
		console.log( 'start ec2 1' );
		var Id = Ids;
		var ec = EC2;
		ec.startInstances(Id, function (err, data) {
			if (err) console.log("OOps! Instance(s) in " + region + " region doesn't fall in the condition this lambda function has been written for!"); // an error occurred
			else console.log(JSON.stringify(data, null, 4)); // successful response
		});
	}
};
