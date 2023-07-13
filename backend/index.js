const Comments=require('./comments')
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
  const postername=req.body.npname;
  console.log("poster name is:",postername)
  console.log("poster name are:",typeof postername)
  console.log("poster name that:",{postername})
  const likes=req.body.likes;
  const favorites=req.body.favorites;
  const currentTime = new Date();
  const newPost=new Posts({
    posttext:posttext,
    postername:postername,
    likes:likes,
    favorites:favorites,
    posttime:currentTime
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
  const likerarray=req.body.array1;
  console.log("likers?"+likerarray);
  Posts.find()
    .then((posts) => {
      console.log(posts.length);
      if (postIndex >= 0 && postIndex < posts.length) {
        // Update the post at the specified index
        posts = posts.map((post, index) => {
          if (index === postIndex) {
            var newliker=false;
            console.log(post.likers);
            for(var i=0;i<likerarray.length;i++){
              console.log(likerarray[i])
              if(!post.likers.includes(likerarray[i].toString())){
                console.log("yes??????")
                post.likers.push(likerarray[i]);
                newliker=true;
              }
            }
            if(newliker==true){
              post.likes = newLikeNum;
            }
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
  const favoriterrray=req.body.array1;
  Posts.find()
    .then((posts) => {
      console.log(posts.length);
      if (postIndex >= 0 && postIndex < posts.length) {
        // Update the post at the specified index
        posts = posts.map((post, index) => {
          if (index === postIndex) {
            for(var i=0;i<favoriterrray.length;i++){
              if(!post.favoriters.includes(favoriterrray[i].toString())){
                post.favorites= newFavoriteString;
                console.log("yes??????")
                post.favoriters.push(favoriterrray[i]);
              }
            }
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
  console.log(req.body.username)
  User.findOne({ username: req.body.sessionName})
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
 
  
});
app.post('/api/favoriteshistory', (req, res) => {
  var array1=[]
  Posts.find()
  .then((posts) => {
    posts = posts.map((post, index) => {
       if(post.favoriters.includes(req.body.username1)){
          array1.push(post)
       }
    });
    res.send(array1)
  })
  .then(() => {
    console.log('Posts updated successfully');
    res.sendStatus(200);
  })
  .catch((error) => {
    console.error('Error updating posts:', error);
    res.sendStatus(500);
  });
});
app.post('/api/addcomments', (req, res) => {
  const { commentator, ctext, ctime, index } = req.body;
  console.log("add comments called!!!!!!")
  Posts.find()
  .then((posts) => {
    console.log(posts.length);
    var postIndex=parseInt(index);
    if (postIndex >= 0 && postIndex < posts.length) {
      // Update the post at the specified index
      posts = posts.map((post, index) => {
        if (index === postIndex) {
           const commentsObj=new Comments({
            commentator:commentator,
            ctext:ctext,
            cTime:ctime
           })
           commentsObj.save();
          post.comments.push(commentsObj)
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
    res.sendStatus(200);
  })
  .catch((error) => {
    console.error('Error updating posts:', error);
    res.sendStatus(500);
  });
});
app.post('/api/addreadposthistory', (req, res) => {
  Posts.find({ postername: req.body.username1 })
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
app.post('/api/addreadpostcomments', (req, res) => {
  console.log("Problem!!!!!!!!")
  const { index } = req.body;
  Posts.find()
  .then((posts) => {
    console.log(posts.length);
    console.log(index)
    var postIndex=parseInt(index);
    if (postIndex >= 0 && postIndex < posts.length) {
      // Update the post at the specified index
      posts = posts.map((post, index) => {
        if (index === postIndex) {
          console.log("clength"+post.comments.length)
           res.send(post.comments)
        }
      });

      // Save the updated posts array
      // return Posts.updateMany({}, { $set: { posts } });
    } else {
      throw new Error('Invalid post index');
    }
  })
  .then(() => {
    // res.sendStatus(200);
  })
  .catch((error) => {
    console.error('Error updating posts:', error);
    res.sendStatus(500);
  });
});
// app.post('/api/addreplycomments',(req,res)=>{
  
// })
app.post('/api/addreplycomments', (req, res) => {
  const { commentator, ctext, ctime, index, commentindex } = req.body;
  console.log("add comments called!!!!!!")
  Posts.find()
    .then((posts) => {
      console.log(posts.length);
      var postIndex = parseInt(index);
      var commentIndex = parseInt(commentindex);
      if (postIndex >= 0 && postIndex < posts.length) {
        // Update the post at the specified index
        const post = posts[postIndex];
        const commentsObj = new Comments({
          commentator: commentator,
          ctext: ctext,
          cTime: ctime
        });
        commentsObj.save();
        console.log("comment?????"+commentindex)
        post.comments.splice(commentIndex+1, 0, commentsObj);
        post.save();

        // Save the updated posts array
        return Posts.updateMany({}, { $set: { posts } });
      } else {
        throw new Error('Invalid post index');
      }
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating posts:', error);
      res.sendStatus(500);
    });
});
app.post('/api/addconnection', (req, res) => {
 const friendname=req.body.username1;
 const myname=req.body.myname;
 User.findOne({ username: myname})
 .then((user) => {
   if (user) {
      user.friends.push(friendname);
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
app.post('/api/readfriends', (req, res) => {
  const myname = req.body.myname;
  User.find({ $or: [{ username: myname }, { friends: myname }] })
    .then((users) => {
      // Find the index of the user with the matching myname
      const index = users.findIndex(user => user.username === myname);
      if (index !== -1) {
        // Remove the user from the current position
        const user = users.splice(index, 1)[0];
        // Add the user at the first position in the array
        users.unshift(user);
      }
      res.send(users);
    })
    .catch((error) => {
      console.error('Error retrieving users:', error);
      res.sendStatus(500);
    });
});
app.post('/api/acceptfriends', (req, res) => {
  const myusername = req.body.myusername;
  const friendname = req.body.friendName;
  console.log("friend????"+friendname)
  console.log("users????")
  User.findOne({ username: myusername })
    .then((myUser) => {
      if (!myUser) {
        throw new Error('User not found');
      }
      
      User.findOne({ username: friendname })
        .then((friendUser) => {
          if (!friendUser) {
            throw new Error('Friend not found');
          }

          const isFriend = myUser.friends.includes(friendUser.username);
          
          if (!isFriend) {
            myUser.friends.push(friendUser.username);
            // friendUser.friends.push(myUser.username);
          }
          if(!friendUser.friends.includes(myUser.friendname)){
            friendUser.friends.push(myUser.username);
          }

          Promise.all([myUser.save(), friendUser.save()])
            .then(() => {
              res.sendStatus(200);
            })
            .catch((error) => {
              console.error('Error saving users:', error);
              res.sendStatus(500);
            });
        })
        .catch((error) => {
          console.error('Error finding friend user:', error);
          res.sendStatus(500);
        });
    })
    .catch((error) => {
      console.error('Error finding my user:', error);
      res.sendStatus(500);
    });
});
app.post('/api/searchposts', (req, res) => {
  console.log("search called!!!!!!");
  var searchtext = req.body.searchtext;
  Posts.find({})
    .then(posts => {
      let matchedPosts = new Map();

      posts.forEach(post => {
        const posttext = post.posttext;

        for (let i = 0; i < searchtext.length; i++) {
          let a = false;

          for (let j = i + 1; j <= searchtext.length; j++) {
            const substring = searchtext.slice(i, j);

            if (posttext.includes(substring)) {
              const score = substring.length;

              if (!matchedPosts.has(post._id) || score > matchedPosts.get(post._id).score) {
                matchedPosts.set(post._id, { post: { ...post.toObject() }, score });
              }

              a = true;
            }
          }

          if (a) {
            break;
          }
        }
      });

      const rankedPosts = Array.from(matchedPosts.values())
        .sort((a, b) => b.score - a.score)
        .map(matchedPost => matchedPost.post)
        .slice(0,5);
       console.log(rankedPosts)
      res.send(rankedPosts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('An error occurred');
    });
})
app.post('/api/trendingposts', (req, res) => {
  console.log("search called!!!!!!");
  var searchtext = req.body.searchtext;
  Posts.find({})
    .then(posts => {
      const rankedPosts = posts
        .map(post => {
          const score = post.likes + post.favorites;
          return { post: { ...post.toObject() }, score };
        })
        .sort((a, b) => b.score - a.score)
        .map(matchedPost => matchedPost.post)
        .slice(0, 5); // Return only the first 5 ranked posts

      res.send(rankedPosts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('An error occurred');
    });
});