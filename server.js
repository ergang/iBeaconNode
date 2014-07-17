var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded());

var mongoose = require('mongoose');
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

var TagModel = mongoose.model('Tag', tagSchema);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.post('/tags', function(req, res) {
	//console.log('POST: ',req.body);
	if(req && req.body) {
		var tag = new TagModel({
			business : req.body.business,
			name : req.body.name
		});

		if(req.body.beacons && req.body.beacons.length > 0) {
			tag.beacons = [];
			req.body.beacons.forEach(function(beacon) {
				tag.beacons.push(beacon);
			});
		}
		tag.save(function(err, t) {
			if(err) {
				res.json(499, {responseCode: 'CANNOT_SAVE_TO_DB', responseMessage: err});
				return;
			}
			
			res.json(t);
			
		});
	} else {
		res.json(400, {responseCode: 'UNABLE_TO_PARSE_BODY'});
	}

});

app.get('/tags/:tagId', function(req, res){
	var tagId = req.param('tagId');
  	TagModel.findById(tagId, function(err, tag) {
  		if(err) {
			res.json(500, {responseCode: 'INTERNAL_SERVER_ERROR', responseMessage: err});
  			return;
  		}

  		if(tag == null) {
  			res.json(499, {responseCode: 'TAG_NOT_FOUND'});
  			return;	
  		}

  		res.json(tag);
  	});
});

app.get('/tags', function(req, res){
	var filterParam = {};

	if(req.query.name) {
		filterParam.name = req.query.name
	}

	if(req.query.business) {
		filterParam.business = req.query.business;
	}

	TagModel.find(filterParam, function(err, tags) {
		if(err) {
			res.json(500, {responseCode: 'INTERNAL_SERVER_ERROR', responseMessage: err});
  			return;
  		}

  		if(tags == null || tags.length == 0) {
  			res.json(499, {responseCode: 'TAG_NOT_FOUND'});
  			return;	
  		}

  		res.json(tags);
	});
});

app.delete('/tags/:tagId', function(req, res) {
	var tagId = req.param('tagId');

	if(tagId) {
		TagModel.findByIdAndRemove(tagId, function(err, data) {
			if(err) {
				res.json(499, {responseCode: 'CANNOT_DELETE', responseMessage: err});
				return;
			}
			res.send(204, '');
		});
	} else {
		res.json(400, {responseCode: 'INVALID_DELETE_PARAMS'});
	}
});

app.delete('/tags', function(req, res) {
	if(req.query && Object.keys(req.query).length !== 0) {
		var deleteCondition = {};
		if(req.query.name) {
			deleteCondition.name = req.query.name
		}

		if(req.query.business) {
			deleteCondition.business = req.query.business;
		}

		TagModel.remove(deleteCondition, function(err, data) {
			if(err) {
				res.json(499, {responseCode: 'CANNOT_DELETE', responseMessage: err});
					return;
			}
			res.send(204, '');
		});

	} else {
		res.json(400, {responseCode: 'INVALID_DELETE_PARAMS'});
	}
});


var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});