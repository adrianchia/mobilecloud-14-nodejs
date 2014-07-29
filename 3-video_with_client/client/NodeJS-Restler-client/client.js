var rest = require('restler');
var BASE_URL = 'http://localhost:3000';
var PATH = BASE_URL + '/video';

rest.post(PATH, {
	data: {name: 'testvideo', url: 'http://google.com', duration: 123}
}).on('complete', function(data, response) {
	console.log(data);
});

rest.get(PATH).on('complete',function(data) {
	console.log(data);
});