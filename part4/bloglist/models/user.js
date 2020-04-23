const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minlength: 3,
		required: true,
		unique: true,
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	],
});

userSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		delete ret.passwordHash;
	}
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;