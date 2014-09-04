// Import required modules
var https = require('https');
var fs = require('fs');
var express = require('express');
//Logging
var morgan = require('morgan');
// Frontend
var gaikan = require('gaikan');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// Security
var oauth2Server = require('oauth2-server');
var models = require('./model');

var app = express();
// Configure the default server-side rendering directory (default: views)
app.set('views', __dirname + '/views');
// Configure express to default to the html extension.
app.set('view engine', 'html');
// Configure express to use the gaikan template engine.
app.engine('html', gaikan);
// parse cookie
app.use(cookieParser('secret'));
app.use(session({secret: 'change me', cookie: {secure: true, maxAge: 60000}}));
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse json
app.use(bodyParser.json());
// Logging
app.use(morgan('combined'));

// OAuth 2 Server
app.oauth = oauth2Server({
	model: require('./model/oauth'),
	grants: ['password'],
	debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/video', app.oauth.authorise() , function getVideoList(req,res) {
	if(req.query.title) {
		models.Video.findOne({name: req.query.title}, function(err,videos){
			if(err) {
				console.log(err);
				res.status(404).send('error getting video with title: ' + req.query.title);
			} else {
				res.json(videos);
			}
		});
	} else {
		models.Video.find({}, function(err,videos){
		if(err) {
			console.log(err);
			res.status(404).send('error getting a list of videos');
		} else {
			res.json(videos);
		}

	});
	}
});

app.post('/video', app.oauth.authorise(), function addVideo(req, res) {
	console.log(req.body);
	var name = req.body.name;
	var url = req.body.url;
	var duration = req.body.duration;

	if(!name || !url || !duration || name.length < 1 || url.length < 10 || isNaN(duration) || parseInt(duration) < 0) {
		res
			.status(400)
			.send("Missing ['name','duration','url'].");
	} else {
		var video = new models.Video({name: name, url: url, duration: duration});
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

app.use(app.oauth.errorHandler());

var https_opt = {
	key: fs.readFileSync('./server.key'),
	cert: fs.readFileSync('./server.crt')
}
https.createServer(https_opt, app).listen(8443, function(){
	console.log('Video Application running at port %d', 8443);
});

function shutdown(sig) {
	//Comment the following to persist across multiple startups
	models.dropDB();
	if(typeof sig === 'string') {
		console.log('%s: Received %s - terminating app ...', Date(Date.now()), sig);
        process.exit(1);
	}
	console.log('%s: Node server stopped.', Date(Date.now()) );
}

//Graceful shutdown
process.on('exit', function(){	shutdown(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(function(element, index, array) {
            process.on(element, function() { shutdown(element); });
});
