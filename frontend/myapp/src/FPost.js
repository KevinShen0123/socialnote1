import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const mongoose = require('mongoose')
function FPost({ authenticated, setAuthenticated, username, setUsername, password, setPassword }){
    const navigate=useNavigate();
    const [searchParams] = useSearchParams();
  const {
    name
  } = Object.fromEntries(searchParams.entries());
  //根据UserName 来fetch Post History
  const[posts,setPosts]=useState([]);
  var username1=name;
  //判断Settings
  useEffect(() => {
    // This code will run once when the component is initially rendered

    // Perform any initialization or side effects here
    console.log('Component loaded');
    const formData={
      username1
    }
    axios
    .post('http://localhost:8000/api/addreadposthistory', formData)
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
      setPosts(newPosts);
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
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
        if (!sessionStorage.getItem('authenticated')) {
          navigate('/login');
        }
      }, [authenticated, navigate]);
    
      useEffect(() => {
        const storedAuthenticated = JSON.parse(sessionStorage.getItem('authenticated'));
        if (storedAuthenticated !== null) {
          setAuthenticated(storedAuthenticated);
        }
      }, [setAuthenticated]);
      function handleConnectInvite(){
       if(username1!=sessionStorage.getItem('username')){
        var myname=sessionStorage.getItem('username')
        const formData={
            username1,
            myname
        }
        axios
        .post('http://localhost:8000/api/addconnection', formData)
        .then((response) => {
          // Handle the response
          alert("Your connection request has been successfully send to "+username1+"!!!!!!!");
        })
        .catch((error) => {
          // Handle any errors
          // console.error(error);
        });
       }
      }
      return(
        <div>
           {posts.map((item,index) => (
        <div key={index}>
        <h2>{item.postername}</h2>
        <p>{item.posttext}</p>
        <h1 >Likes: {item.likes}</h1>
         <h1>Favorites: {item.favorites}</h1>
         <h2>PostTime:{item.posttime.toString()}</h2>
         <button type="button" onClick={handleConnectInvite}>Invite to Connect</button>
        </div>
       ))}
        </div>
      )
}
export default FPost