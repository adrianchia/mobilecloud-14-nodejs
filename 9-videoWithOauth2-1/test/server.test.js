process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Handles Self-sign SSL for testing

var should = require('should');
require('should-http');
var request = require('supertest');
var express = require('../server');
var uuid = require('node-uuid');

var BASE_URL = 'https://localhost:8443';

describe('Test Video Service with OAuth Resource Owner Password Flow',
	function() {
	'use strict';
	var accessToken;
	var clientId = "mobile";
	var clientSecret = "test";
	var clientCredentials = new Buffer(clientId + ':' + clientSecret).toString('base64');

	var myRandomID = uuid.v4();
  var title = 'Video - ' + myRandomID;
	var videoUrl = 'http://coursera.org/some/video-' + myRandomID;
	var dur = 60 * 10 * 1000;

	it('should throw 400 error on GET', function(done) {
		request(BASE_URL)
			.get('/video')
			.expect(400)
			.end(function(err,res) {
				res.should.be.json;
				res.body.should.have.properties(['code','error','error_description']);
				done();
			});
	});

	it('should throw 400 error on POST', function(done) {
		request(BASE_URL)
		  .post('/video')
			.set('Content-Type','application/x-www-form-urlencoded')
			.send({"name": title, "url": videoUrl, "duration": dur})
			.end(function(err,res) {
				res.should.be.json;
				res.body.should.have.properties(['code','error','error_description']);
				done();
			});
	});

	it('should allow token to be requested', function(done) {
		request(BASE_URL)
			.post('/oauth/token')
			.auth(clientId, clientSecret)
			.set('Content-Type','application/x-www-form-urlencoded')
			.send({
				"grant_type": "password",
				"username": "coursera",
				"password": "changeit"
			})
			.expect(200)
			.end(function(req,res) {
				res.should.be.json;
				res.body.should.have.properties(['token_type','access_token','expires_in']);
				accessToken = res.body.access_token;
				done();
			});
	});

	it('should allow video to be added', function(done) {
		request(BASE_URL)
			.post('/video')
			.set('Authorization', 'Bearer ' + accessToken)
			.set('Content-Type','application/x-www-form-urlencoded')
			.send({"name": title, "url": videoUrl, "duration": dur})
			.expect('Content-Type', /text\/plain/)
			.expect(200)
			.expect('Video added.', done);
	});

	it('should list added video(s)', function(done) {
		request(BASE_URL)
			.get('/video')
			.set('Authorization', 'Bearer ' + accessToken)
			.expect(200)
			.end(function(err, res) {
				res.should.be.json;
				res.body.should.be.an.Array;
				done();
			});
	});

	it("should return Missing ['name','duration','url'].", function(done) {
		request(BASE_URL)
			.post('/video')
			.set('Authorization', 'Bearer ' + accessToken)
			.set('Content-Type','application/x-www-form-urlencoded')
			.send({"name": '', "url": 'www.a.com', "duration": 1})
			.expect(400)
			.expect("Missing ['name','duration','url'].", done);
	});
});
