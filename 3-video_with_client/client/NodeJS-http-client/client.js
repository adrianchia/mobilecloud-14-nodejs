// Import required modules
var http = require('http');

//Post a video in application/x-www-form-urlencoded
var videoStr = 'name=test&url=http://www.google.com&duration=123';
var options = {
	hostname: 'localhost',
	port: 3000,
	path: '/video',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(videoStr, 'utf8')
	}
}
var postVideo = http.request(options, function(res){
	console.log('STATUS: ' + res.statusCode);
	// Uncomment the following to see the response header
	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding('utf8');

    res.on('data', function(data) {
      console.log('BODY: ' + data);
    });

    
});

postVideo.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

console.log(videoStr);
postVideo.write(videoStr);
postVideo.end();

//List All videos
options = {
	hostname: 'localhost',
	port: 3000,
	path: '/video',
	method: 'GET',
}
var listVideos = http.get(options,function (res){
	console.log('STATUS: ' + res.statusCode);
	res.on('data', function(chunk){
		console.log('result: ' + chunk);
	});
});