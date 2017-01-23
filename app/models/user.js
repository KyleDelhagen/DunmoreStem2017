var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local       :{
        username        : String,
        password        : String,
        realname            : String,
	    isAdmin		: Boolean,
	    emoji: []
    },
    publicReport       :{//This would be if they wanted to say general thoughts
        realname            : String,
	    date: String,
	    message: []
    },
    privateReport		 :{//this would be for reporting other students or for guidence
    	realname			: String,
		date: String,
		message:[]
    }
});







userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports  = mongoose.model('User', userSchema);
