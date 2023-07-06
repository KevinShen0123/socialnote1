import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
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
  const[post,setPost]=useState([])
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
      console.log(response.data)
      const newPosts = response.data.map((item) => ({
        postername: item.postername,
        posttext: item.posttext,
        likes: item.likes,
        favorites: item.favorites,
      }));

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
    setPost([
      ...post,
      {
        postername: username.toString(),
        posttext: posttext,
        likes: "0",
        favorites: "0",
      },
    ]);
    const formData = {
      posttext,
      postername,
      likes,
      favorites
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
    const updatedPost = post.map((item, i) => {
      console.log("i is?"+i)
      newlikenum=String(parseInt(item.likes)+1)
      if (i === index) {
        return {
          ...item,
          likes: String(parseInt(item.likes)+1),
          favorites: String(parseInt(item.favorites)),
        };
      }
      return item;
    });
    setPost(updatedPost);
    const formData={
      index,
      newlikenum
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
    const updatedPost = post.map((item, i) => {
      if (i === index) {
        newFavoriteString= String(parseInt(item.favorites) + 1);
        return {
          ...item,
          likes: String(parseInt(item.likes)),
          favorites: String(parseInt(item.favorites) + 1),
        };
      }
      return item;
    });
    const formData={
      index,
      newFavoriteString
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
  return (
    <form onSubmit={handleFormSubmit}>
      <textarea className="createposts" onChange={handlePostText}></textarea>
      <button type="submit" className="createNewPost">create new post</button>
      {post.map((item,index) => (
        <div key={index}>
        <h2>{item.postername}</h2>
        <p>{item.posttext}</p>
        <button type="button" onClick={(event) => handleLikeFL(event, index)} >Likes: {item.likes}</button>
         <button type="button"onClick={(event) => handleFavoriteFL(event, index)}>Favorites: {item.favorites}</button>
        </div>
       ))}
    </form>
  );
}

export default Posts;