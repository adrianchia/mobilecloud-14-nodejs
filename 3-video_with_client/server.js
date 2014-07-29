// Import required modules
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));

var videos = [];

app.get('/video', function(req,res) {
	var output = "";
	for(var i=0; i<videos.length; i++) {
		output += videos[i].name + ' : ' +  videos[i].url + '\n';
	}
	res
		.header('Content-Type', 'text/plain')
		.send(output);
});

app.post('/video', function(req, res) {
	console.log(req.body);
	var name = req.body.name;
	var url = req.body.url;
	var duration = req.body.duration;

	if(!name || !url || !duration || name.length < 1 || url.length < 10 || isNaN(duration) || parseInt(duration) < 0) {
		res
			.status(400)
			.send("Missing ['name','duration','url'].");
	} else {
		videos.push({name: name, url: url, duration: duration});
		res
			.header('Content-Type', 'text/plain')
			.send('Video added.');
	}
});

// Run the application on port 3000
app.listen(3000, function() {
	console.log('Video Application running at %d', 3000);
});