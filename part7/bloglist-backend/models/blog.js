const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	comments: [{
		comment: {
			type: String,
			required: true
		},
	}]
});

blogSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		if (ret.comments) {
			for (let cm of ret.comments) {
				cm.id = cm._id.toString();
				delete cm._id;
			}
		}
	}
});

module.exports = mongoose.model('Blog', blogSchema);