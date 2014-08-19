var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
	name: String,
	url: String,
	duration: Number
});

videoSchema.index({name: 1});
videoSchema.index({duration: 1});

module.exports = mongoose.model('Video', videoSchema);