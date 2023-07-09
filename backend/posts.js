const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  commentator: String,
  ctext: String,
  cTime: { type: Date },
});
const postsSchema = new mongoose.Schema({
  posttext: String,
  postername: String,
  likes: String,
  favorites: String,
  posttime: { type: Date },
  likers: [],
  favoriters: [],
  comments: [commentsSchema] // Use commentsSchema instead of Comments
});

const Posts = mongoose.model('Posts', postsSchema);
module.exports = Posts;