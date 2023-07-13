import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes, createSearchParams } from 'react-router-dom';
import './posts.css';
import logo from "./twitter-logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Posts({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {
  const navigate = useNavigate();
  const [postername, setPostername] = useState('');
  const [posttext, setPosttext] = useState('');
  const [likes, setLikes] = useState('0');
  const[favorites,setFavorites]=useState('0');
  const[likers,setLikers]=useState([]);
  const[favoriters,setFavoriters]=useState([]);
  const[post,setPost]=useState([])
  const[posttime,setPosttime]=useState(new Date());
  const[comments,setComments]=useState([''])
  const postobj={
    posttext,
    postername,
    likes,
    favorites
  }
  postobj.postertext=posttext
  postobj.postername=postername
  postobj.likes=likes
  postobj.favorites=favorites
  useEffect(() => {
    // This code will run once when the component is initially rendered

    // Perform any initialization or side effects here
    console.log('Component loaded');
    const formData={
      postername,
      posttext
    }
    axios
    .post('http://localhost:8000/api/readpost', formData)
    .then((response) => {
      // Handle the response
      console.log("kidding????????")
      console.log(response.data)
      const newPosts = response.data.map((item) => ({
        postername: item.postername,
        posttext: item.posttext,
        likes: item.likes,
        favorites: item.favorites,
        posttime:item.posttime,
        likers:item.likers,
        favoriters:item.favoriters,
        comments:item.comments
      }));
      console.log("new Posts?"+Object.values(newPosts))
      setPost(newPosts);
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
    // Clean up any resources if necessary
    return () => {
      console.log('Component unloaded');
      // Clean up code here
    };
  }, []);
  useEffect(() => {
    console.log('Authenticated value changed:', sessionStorage.getItem('authenticated'));
    // Perform actions based on the updated authenticated value
    if (sessionStorage.getItem('authenticated')) {
      console.log('authenticated!!!!!!!!!!!!!');
    } else {
      navigate('/login');
    }
  }, [authenticated,navigate]);
  useEffect(() => {
    const storedAuthenticated = JSON.parse(sessionStorage.getItem('authenticated'));

    if (storedAuthenticated !== null) {
      setAuthenticated(storedAuthenticated);
    }
  }, [setAuthenticated]);
  const handleFormSubmit = (event) => {

    event.preventDefault();
    console.log(sessionStorage.getItem('username'));
    setPost([
      ...post,
      {
        postername: sessionStorage.getItem('username'),
        posttext: posttext,
        likes: "0",
        favorites: "0",
        posttime:new Date(),
        likers:[],
        favoriters:[]
      },
    ]);
    setPostername(sessionStorage.getItem('username'));
    var npname=sessionStorage.getItem('username');
    const formData = {
      posttext,
      npname,
      likes,
      favorites,
    };
    console.log("fetch called!!!!!");
    axios
      .post('http://localhost:8000/api/createposts', formData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        console.log(typeof response.data)
        if(response.data.includes("failed")){
           console.log(response.data)
           alert("createposts error")
        }else{
          var obj=document.getElementsByClassName('createposts')[0];
          obj.value="";
          window.location.reload();
           console.log("success!!!!!!")
        }
      })
      .catch((error) => {
        // Handle any errors
        // console.error(error);
      });
  };
  const fetchData = async () => {
    try {
 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handlePostText = (event) => {
    console.log(event.target.value);
    setPosttext(event.target.value);
    setPostername(username.toString())
    setLikes("0")
    setFavorites("0");
  };
  const handleLikeFL = (event,index) => {
    console.log("Like handler is called!"+index);
    var newlikenum="0"
    var array1=[]
    const updatedPost = post.map((item, i) => {
      console.log("i is?"+i)
      newlikenum=String(parseInt(item.likes)+1)
      console.log("post?"+item);
      if (i === index&&!item.likers.includes(sessionStorage.getItem('username'))) {
        console.log("usernameString?"+sessionStorage.getItem('username'))
        array1.push(sessionStorage.getItem('username'));
        return {
          ...item,
          likes: String(parseInt(item.likes)+1),
          favorites: String(parseInt(item.favorites)),
          likers:array1
        };
      }
      return item;
    });

    for(var i=0;i<array1.length;i++){
      console.log("array1new?"+array1[i]);
    }
    setPost(updatedPost);
    const formData={
      index,
      newlikenum,
      array1
    };
    axios
      .post('http://localhost:8000/api/updatepostlikes', formData)
      .then((response) => {
        // Handle the response
    
        if(response.data.includes("failed")){
           console.log(response.data)
           window.location.reload()
           alert("createposts error")
        }else{
           console.log("success!!!!!!")
        }
      })
      .catch((error) => {
        // Handle any errors
        // console.error(error);
      });
  };
  const handleFavoriteFL = (event, index) => {
    console.log("favorite handler is called!");
    var newFavoriteString="0";
    var array1=[];
    const updatedPost = post.map((item, i) => {
      if (i === index&&!item.favoriters.includes(sessionStorage.getItem('username'))) {
        console.log("f???????????");
        array1.push(sessionStorage.getItem('username'));
        newFavoriteString= String(parseInt(item.favorites) + 1);
        return {
          ...item,
          likes: String(parseInt(item.likes)),
          favorites: String(parseInt(item.favorites) + 1),
          favoriters:array1
        };
      }
      return item;
    });
    const formData={
      index,
      newFavoriteString,
      array1
    }
    axios
    .post('http://localhost:8000/api/updatepostfavorites', formData)
    .then((response) => {
      // Handle the response
    })
    .catch((error) => {
      // Handle any errors
      // console.error(error);
    });
    setPost(updatedPost);
  };
  const handleViewComments = (event, index) => {
    event.preventDefault();
    //先用index Post 拿到数据，再传送给PostDetail界面
    // const navigate=useNavigate('/postDetail/${index}');
    console.log("Called>>>>>>>>>>")
    const updatedPost = post.map((item, i) => {
      console.log("i"+i)
      if (i === index) {
        console.log("length here？"+item.comments.length)
        console.log(item.comments)
        console.log("yes???????")
        const postername=item.postername
        const posttext=item.posttext
        const likes=item.likes
        const favorites=item.favorites
        const likers=item.likers
        const favoriters=item.favoriters
        const comments=item.comments
        const posttime=item.posttime
        console.log("Time here"+posttime)
      //  navigate('/postDetail',{postername,posttext,likes,favorites,posttime,likers,favoriters,comments})
       sessionStorage.setItem("comments",JSON.stringify(comments))
       const params = new URLSearchParams();
      params.append('index', i);
      params.append('postername', postername);
      params.append('posttext', posttext);
       params.append('likes', likes);
      params.append('favorites', favorites);
      params.append('posttime', posttime);
      params.append('likers', likers);
      params.append('favoriters', favoriters);
      params.append('comments', JSON.stringify(comments));
navigate({
  pathname: '/postDetail',
  search: params.toString(),
});
      }
      return item;
    });
  }
  const handleSeeProfile = (event, index,name) => {
    event.preventDefault();
    const formData={
      name
    }
    const params = new URLSearchParams();
    params.append('name', name);
    navigate({
      pathname: '/fPost',
      search: params.toString(),
    });
    
  }
  const handleSearchPosts = (event, index) => {
    event.preventDefault();
    var searchtext=document.getElementsByClassName('searchposts')[0].value;
    const params = new URLSearchParams();
    params.append('searchtext',searchtext);
    navigate({
      pathname: '/searchresult',
      search: params.toString(),
    });
  }
  const handleTrendingPosts=(event,index)=>{
    event.preventDefault();
    navigate('/trendingposts');
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <button type="button" onClick={handleTrendingPosts}>see Trending Posts</button>
  <textarea className="searchposts" onChange={handlePostText}></textarea>
  <button type="button" className="searchPost" onClick={handleSearchPosts}>search posts</button>
  <div>
  <textarea className="createposts" onChange={handlePostText}></textarea>
  <button type="submit" className="createNewPost">create new post</button>
  </div>
  {post.map((item, index) => {
    if (item.postername === sessionStorage.getItem('username')) {
      return (
        <div key={index}>
          <h2>{item.postername}</h2>
          <p>{item.posttext}</p>
          <button type="button" onClick={(event) => handleLikeFL(event, index)}>Likes: {item.likes}</button>
          <button type="button" onClick={(event) => handleFavoriteFL(event, index)}>Favorites: {item.favorites}</button>
          <button type="button" onClick={(event) => handleViewComments(event, index)}>View Comments</button>
          <h2>PostTime: {item.posttime.toString()}</h2>
        </div>
      );
    } else {
      return (
        <div key={index}>
          <h2>{item.postername}<button className="seeProfile" onClick={(event) => handleSeeProfile(event, index, item.postername)}>See Posts History</button></h2>
          <p>{item.posttext}</p>
          <button type="button" onClick={(event) => handleLikeFL(event, index)}>Likes: {item.likes}</button>
          <button type="button" onClick={(event) => handleFavoriteFL(event, index)}>Favorites: {item.favorites}</button>
          <button type="button" onClick={(event) => handleViewComments(event, index)}>View Comments</button>
          <h2>PostTime: {item.posttime.toString()}</h2>
        </div>
      );
    }
  })}
</form>
  );
}

export default Posts;