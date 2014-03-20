var express = require('express');
var app = express();

app.get('/location_attr', function(req, res){
  res.send("what's up iBeacon people");
});

var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});