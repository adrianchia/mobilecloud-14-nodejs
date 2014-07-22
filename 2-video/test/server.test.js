var request = require('supertest');
var express = require('../server');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');

var BASE_URL = 'http://localhost:3000';

describe('Video test add and list', function() {
	var myRandomID = uuid.v4();
		var title = 'Video - ' + myRandomID;
		var videoUrl = 'http://coursera.org/some/video-' + myRandomID;
		var dur = 60 * 10 * 1000;

	it('should add video', function(done) {

		request(BASE_URL)
			.post('/video')
			.set('Content-Type','application/x-www-form-urlencoded')
			.send({"name": title, "url": videoUrl, "duration": dur})
			.expect('Content-Type', /text\/plain/)
			.expect(200)
			.expect('Video added.', done);
			
	});

	it('should list added video', function(done) {
		request(BASE_URL)
			.get('/video')
			.expect('Content-Type', /text\/plain/)
			.expect(200)
			.expect(title + ' : ' + videoUrl + '\n', done);
	});

	it("should return Missing ['name','duration','url'].", function(done) {
		request(BASE_URL)
			.post('/video')
			.set('Content-Type','application/x-www-form-urlencoded')
			.send({"name": '', "url": 'www.a.com', "duration": 1})
			.expect(400)
			.expect("Missing ['name','duration','url'].", done);
	});
});

