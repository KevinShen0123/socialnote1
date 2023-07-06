const mongoose = require('mongoose')
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
mongoose.connect('mongodb://localhost/mydatabase', options)
const postsSchema=new mongoose.Schema({
    posttext:String,
    postername:String,
    likes:String,
    favorites:String
  });
  const Posts=mongoose.model('Posts',postsSchema);
  module.exports=Posts;