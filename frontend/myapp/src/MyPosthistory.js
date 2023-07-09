
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
import './posts.css';
import logo from "./twitter-logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function MyPostHistory({ authenticated, setAuthenticated, username, setUsername, password, setPassword }){
    const[post,setPost]=useState([])
    const navigate=useNavigate();
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
      useEffect(() => {
        // This code will run once when the component is initially rendered
    
        // Perform any initialization or side effects here
        console.log('Component loaded');
        var username1=sessionStorage.getItem('username');
        const formData={
          username1
        }
        axios
        .post('http://localhost:8000/api/addreadposthistory', formData)
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
return(
    <form>
    {post.map((item,index) => (
        <div key={index}>
        <h2>{item.postername}</h2>
        <p>{item.posttext}</p>
        <button type="button" >Likes: {item.likes}</button>
         <button type="button">Favorites: {item.favorites}</button>
        </div>
       ))}
       </form>
)
}
export default MyPostHistory