const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bucket = new Schema({

	bucketVolume: [{
		name: {
			type: String,
			required: true
		},
		volume: {
			type: Number,
			required: true
		},
		emptyVolume: {
			type: Number
		},
		isFilled: {
			type: Boolean,
			default: false
		}
	}],

	ballsVolume: [{
		name: {
			type: String,
			required: true
		},
		volume: {
			type: Number,
			required: true
		}
	}],
	sessionName: {
		type: String,
	}
},
	{
		timestamps: true
	});


module.exports = mongoose.model("bucket", bucket);