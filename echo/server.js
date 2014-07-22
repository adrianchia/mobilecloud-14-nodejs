// Import required modules
var express = require('express');
var app = express();

/*
 When user visit http://<hostname>:3000?msg=asdf, 
 echo back to the client with the msg that was sent
 */
app.get('/', function(req,res) {
	res
		.header('Content-Type', 'text/plain')
		.send('Echo:' + req.query.msg);
});

// Run the application on port 3000
app.listen(3000, function() {
	console.log('Echo server running at %d', 3000);
});