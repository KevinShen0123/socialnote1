const mongoose = require('mongoose')
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
mongoose.connect('mongodb://localhost/newdatabase', options)
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profileV:String,
    friends:[]
  });
const User = mongoose.model('User', userSchema);
module.exports = User;


  