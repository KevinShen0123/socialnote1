const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let connection = null;

// Function to connect to the database
function connectToDatabase() {
  if (connection) {
    // If connection already exists, use it
    return Promise.resolve(connection);
  } else {
    // If connection doesn't exist, create a new one
    return mongoose.connect('mongodb://localhost/newdatabase', options)
      .then((db) => {
        connection = db;
        return connection;
      });
  }
}

const postsSchema = new mongoose.Schema({
  posttext: String,
  postername: String,
  likes: String,
  favorites: String,
  posttime: { type: Date},
  likers:[],
  favoriters:[]
});

// Declare the Posts model outside of connectToDatabase
const Posts = mongoose.model('Posts', postsSchema);
module.exports=Posts;
// Connect to the database
connectToDatabase().then(() => {
  // Perform your database operations using the Posts model
});