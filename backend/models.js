const mongoose = require('mongoose')
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
mongoose.connect('mongodb://localhost/mydatabase', options)
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
const User = mongoose.model('User', userSchema);
// const db = mongoose.connection;
// db.on('error', (error) => {
//     alert('Connection error: ' + error);
//   });
//   db.once('connected', () => {
//     alert('Connected to MongoDB!');
//   });
module.exports = User;


  