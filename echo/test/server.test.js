var request = require('supertest');
var express = require('../server');

describe('Echo Test', function() {
	it('should return Echo:asdf', function(done) {
		request('http://localhost:3000')
			.get('?msg=asdf')
			.expect('Content-Type', /text\/plain/)
			.expect(200)
			.expect('Echo:asdf', done);
	});
});