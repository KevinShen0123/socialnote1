const express = require('express');
const User = require('./models');
const Posts=require('./posts');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const port = 8000;
// Define a route
app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});
app.post('/api/login', (req, res) => {
  console.log("called here!")
  const yourusername = req.body.username;
  const yourpassword = req.body.password;

  console.log('Username:', yourusername);
  console.log('Password:', yourpassword);
  var returnstr="succeed!!!!!"
  async function getUsers() {
    try {
      const users = await User.find({});
      console.log(users.username);
      console.log(users.password);
    } catch (error) {
      console.error(error);
    }
  }
  
  getUsers();
  User.find({ username: yourusername})
  .maxTimeMS(1000)
  .then((users) => {
    if(users.length==0){
     returnstr="UserName: failed!!!!!!!!"
    }
    users.forEach((user) => {
      console.log('Matching User:', user);
      // Perform operations on each user
      if(yourpassword!=user.password){
        returnstr+="Password Match failed!!!!!!!!!!!!!"
      }
    });
    res.send(returnstr);
  })
  .catch((error) => {
    console.error('Error finding matching users:', error);
    res.send("login failed!!!!!");
  });
});
app.post('/api/register', (req, res) => {
  const yourusername = req.body.username;
  const yourpassword = req.body.password;
  var returnstr="failed!!!!!"
  console.log('UsernameRegister:', yourusername);
  console.log('PasswordRegister:', yourpassword);
  User.find({ username: yourusername})
  .maxTimeMS(1000)
  .then((users) => {
    if(users.length==0){
     returnstr="succeed!!!!!!!!"
     const newUser = new User({
      username: yourusername,
      password: yourpassword,
    });

    // Save the new user to the database
    newUser.save()
      .then(() => {
        console.log('User saved:', newUser);
      })
      .catch((error) => {
        console.error('Error saving user:', error);
        returnstr="failed!!!!"
      });
    }
    users.forEach((user) => {
      console.log('Matching User:', user);
      // Perform operations on each user
    });
    res.send(returnstr);
  })
  .catch((error) => {
    console.error('Error finding matching users:', error);
    res.send("register succeed!!!!!");
  });
});
app.post('/api/createposts', (req, res) => {
  const posttext=req.body.posttext;
  const postername=req.body.postername;
  console.log("poster name is:",postername)
  console.log("poster name are:",typeof postername)
  console.log("poster name that:",{postername})
  const likes=req.body.likes;
  const favorites=req.body.favorites;
  const newPost=new Posts({
    posttext:posttext,
    postername:postername,
    likes:likes,
    favorites:favorites
  })
  newPost.save()
  .then(() => {
    console.log('Post saved:', newPost);
    res.send('succeed!');
  })
  .catch((error) => {
    console.error('Error saving user:', error);
    res.send('failed!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.post('/api/readpost', (req, res) => {
  Posts.find()
  .then((posts) => {
    // Handle the found posts
    console.log(posts);
    console.log("Type is"+typeof posts);
    // ... do something with the posts array
    res.send(posts);
  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });
});
app.post('/api/updatepostlikes', (req, res) => {
  var postIndex = parseInt(req.body.index);
  const newLikeNum = req.body.newlikenum;
  
  Posts.find()
    .then((posts) => {
      console.log(posts.length);
      if (postIndex >= 0 && postIndex < posts.length) {
        // Update the post at the specified index
        posts = posts.map((post, index) => {
          if (index === postIndex) {
            post.likes = newLikeNum;
            post.save();
          }
        });

        // Save the updated posts array
        return Posts.updateMany({}, { $set: { posts } });
      } else {
        throw new Error('Invalid post index');
      }
    })
    .then(() => {
      console.log('Posts updated successfully'+postIndex);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating posts:', error);
      res.sendStatus(500);
    });
});
app.post('/api/updatepostfavorites', (req, res) => {
  var postIndex = parseInt(req.body.index);
  const newFavoriteString = req.body.newFavoriteString;
  
  Posts.find()
    .then((posts) => {
      console.log(posts.length);
      if (postIndex >= 0 && postIndex < posts.length) {
        // Update the post at the specified index
        posts = posts.map((post, index) => {
          if (index === postIndex) {
            post.favorites= newFavoriteString;
            post.save();
          }
        });

        // Save the updated posts array
        return Posts.updateMany({}, { $set: { posts } });
      } else {
        throw new Error('Invalid post index');
      }
    })
    .then(() => {
      console.log('Posts updated successfully'+postIndex);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating posts:', error);
      res.sendStatus(500);
    });
});
app.post('/api/updatepassword', (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        user.password = req.body.newpassword;
        return user.save();
      } else {
        throw new Error('User not found');
      }
    })
    .then((updatedUser) => {
      // sessionStorage.setItem('password', updatedUser.password);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating password:', error);
      res.sendStatus(500);
    });
});
app.post('/api/updatepostcontent', (req, res) => {
  var newpassword=req.body.newpassword;
  var username=req.body.username;
  
});
app.post('/api/addcomments', (req, res) => {
  
});
app.post('/api/addreadposthistory', (req, res) => {
  Posts.find({ postername: req.body.username })
  .then((posts) => {
    // Handle the found posts
    console.log(posts);
    console.log("Type is"+typeof posts);
    // ... do something with the posts array
    res.send(posts);
  })
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });
});