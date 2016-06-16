var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: number, default: 0},
  post: {type: mongoose.Schema.Types.ObjectID, ref: 'Post'}
});

mongoose.model('Comment', CommentSchema);
