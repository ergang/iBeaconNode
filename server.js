var express = require('express');
var app = express();

var mongoose = request('mongoose');
mongoose.connect('mongodb://localhost/beacon_db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

});

var tagSchema = mongoose.Schema({
	business: String,
    name : String,
    beacons: [{
    	uuid: String,
    	major: String,
    	minor: String,
    	distance: Number,
    	rssi: Number
    }]
});

var Tag = moongose.model('Tag', tagSchema);

app.post('/tags', function(req, res)) {
	if(req && req.body) {
		var tag = new Tag({
			business : req.body.business,
			name : req.body.name
		});

		if(request.body.beacons && req.body.beacons.length > 0) {
			tag.beacons = [];
			req.body.beacons.forEach(function(beacon) {
				tag.beacons.push[beacon];
			});
		}
		tag.save(function(err, t) {
			if(err) {
				res.json(499, {responseCode: 'CANNOT_SAVE_TO_DB', responseMessage: err});
				return;
			}
			
			res.json(t);
			
		});
	}	

});

app.get('/tags', function(req, res){
  
});


var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});