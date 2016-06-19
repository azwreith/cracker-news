var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true
	},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = cryto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

mongoose.model('User', UserSchema);
