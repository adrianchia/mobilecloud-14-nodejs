// Import required modules
var https = require('https');
var fs = require('fs');
var express = require('express');
var router = express
//Logging
var morgan = require('morgan');
// Frontend
var gaikan = require('gaikan');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// Database
var mongoose = require('mongoose');
var Video = require('./model/video');
// Security
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Connect to local MongoDB instance to 'mobilecloud' database. The standard URI connection scheme
// is mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
mongoose.connect('mongodb://localhost/mobilecloud');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('disconnected', function() {
	console.log('MongoDB disconnected');
});
db.once('open', function callback () {
  console.log('connected to MongoDB');
});


var users = [
	{ id: 1, username: 'coursera', password: 'changeit', roles: ['admin','user'] },
	{ id: 2, username: 'student', password: 'changeit', roles: ['user'] },
];

function findById(id, callback) {
	var i = id -1;
	if(users[i]) {
		callback(null, users[i]);
	} else {
		callback(new Error('User ' + id + 'does not exists'));
	}
}

function findByUsername(username, callback) {
	for(var i=0; i<users.length;i++) {
		if(users[i].username === username) {
			return callback(null, users[i]);
		}
	}
	return callback(null, null);
}

//Passport Serialization / deserialization
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function(err, user) {
		done(err, user);
	});
});

// Use the local strategy within passport
passport.use( new LocalStrategy(
	function(username, password, done) {
		process.nextTick(function() {
			findByUsername(username, function(err, user) {
				if(err) {
					return done(err);
				}
				if(!user) {
					return done(null, false, {message: 'Unknown user ' + username});
				}
				if(user.password != password) {
					return done(null, false, {message: 'Invalid password'});
				}
				return done(null, user);
			});
		});
	}
));

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
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req,res) {
	res.render('login', {user: req.user, message: req.flash('error')});
});

app.post('/login', 
	passport.authenticate('local', {  successReturnToOrRedirect: '/home', failureRedirect: '/login', failureFlash: true }));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});

app.get('/home', ensureAuthenticated, function(req,res) {
	res.render('home', {user: req.user});
});

app.get('/video', ensureAuthenticated, function getVideoList(req,res) {
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

app.post('/video', ensureAuthenticated, function addVideo(req, res) {
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
/*app.listen(3000, function() {
	console.log('Video Application running at %d', 3000);
});
*/
var https_opt = {
	key: fs.readFileSync('./server.key'),
	cert: fs.readFileSync('./server.crt')
}
https.createServer(https_opt, app).listen(443, function(){
	console.log('Video Application running at port %d', 443);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function shutdown(sig) {
	//Comment the following to persist across multiple startups
	db.collections['videos'].drop();
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