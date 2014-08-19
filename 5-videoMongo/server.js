// Import required modules
var express = require('express');
var router = express
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Video = require('./model/video');

// Connect to local MongoDB instance to 'mobilecloud' database. The standard URI connection scheme
// is mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
mongoose.connect('mongodb://localhost/mobilecloud');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('connected to MongoDB');
});

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse json
app.use(bodyParser.json());
// Logging
app.use(morgan('combined'));

app.get('/video', function getVideoList(req,res) {
	if(req.query.title) {
		Video.findOne({name: req.query.title}, function(err,videos){
			if(err) {
				console.log(err);
				res.status(404).send('error getting video with title: ' + req.query.title);
			} else {
				res.json(videos);
			}
		});
	} else {
		Video.find({}, function(err,videos){
		if(err) {
			console.log(err);
			res.status(404).send('error getting a list of videos');
		} else {
			res.json(videos);
		}

	});
	}
});

app.post('/video', function addVideo(req, res) {
	console.log(req.body);
	var name = req.body.name;
	var url = req.body.url;
	var duration = req.body.duration;

	if(!name || !url || !duration || name.length < 1 || url.length < 10 || isNaN(duration) || parseInt(duration) < 0) {
		res
			.status(400)
			.send("Missing ['name','duration','url'].");
	} else {
		var video = new Video({name: name, url: url, duration: duration});
		video.save(function(err){
			if(err) {
				console.log(err);
				res
					.status(500)
					.send('error saving video');
			}
			else {
				res
					.header('Content-Type', 'text/plain')
					.send('Video added.');
			}
		});
		
	}
});

// Run the application on port 3000
app.listen(3000, function() {
	console.log('Video Application running at %d', 3000);
});