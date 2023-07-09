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

const commentsSchema = new mongoose.Schema({
  commentator:String,
  ctext:String,
  cTime:{ type: Date},
});

// Declare the Posts model outside of connectToDatabase
const Comments = mongoose.model('Comments', commentsSchema);
module.exports=Comments// Connect to the database
connectToDatabase().then(() => {
  // Perform your database operations using the Posts model
});