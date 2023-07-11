import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
import './login.css';
import logo from "./twitter-logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Friends({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {
  const navigate = useNavigate();
  const[friends,setFriends]=useState([])
  var targetName=""
  var targetSentence=""
  var targetStatus=""
  useEffect(() => {
    const fetchData = async () => {
      console.log("use effect called!!!!!!!")
      try {
        var myname=sessionStorage.getItem('username');
        const formData = {
          myname
        };
        const response = await axios.post('http://localhost:8000/api/readfriends', formData);
         //check users
         var myuser=response.data[0];
         var fobj=[]
         for(let i=0;i<response.data.length;i++){
           if(i!=0){
             var A=myuser.friends.includes(response.data[i].username);
             var B=response.data[i].friends.includes(myuser.username);
             if(A==true&&B==true){
              const friendObj={
                targetName,
                targetSentence,
                targetStatus
              }
              friendObj.targetName=response.data[i].username;
              friendObj.targetSentence="You have accepted "+response.data[i].username+"as your friends";
              friendObj.targetStatus="accepted";
              fobj.push(friendObj)
             }else if(A==true&&B==false){
              const friendObj={
                targetName,
                targetSentence,
                targetStatus
              }
              friendObj.targetName=response.data[i].username;
              friendObj.targetSentence="You have invited "+response.data[i].username+"to be your friends";
              friendObj.targetStatus="pending";
              fobj.push(friendObj)
             }else if(A==false&&B==true){
              const friendObj={
                targetName,
                targetSentence,
                targetStatus
              }
              friendObj.targetName=response.data[i].username;
              friendObj.targetSentence="You have  been invited by "+response.data[i].username+"to be friend";
              friendObj.targetStatus="invite pending";
              fobj.push(friendObj)
             }
           }
         }
         setFriends(fobj);
      } catch (error) {
        console.log("Error:", error);
      }
    };
  
    const intervalId = setInterval(fetchData, 30);
  
    // Clean up the interval when the component is unmounted or the effect is re-executed
    return () => clearInterval(intervalId);
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
  const handleAcceptFriend = (friendName) => {
    // Implement your logic to accept the friend invitation
    console.log("Accepted friend invitation from", friendName);
    var myusername=sessionStorage.getItem('username');
    const formData={
      myusername,
      friendName
    }
    axios
    .post('http://localhost:8000/api/acceptfriends', formData)
    .then((response) => {
       
      // window.location.reload();
    })
    .catch((error) => {
      // Handle any errors
      // console.error(error);
    });
  };
  return (
    <div>
        <div>
      {friends.map((friend, index) => (
        <div key={index}>
          <h2>{friend.targetName}</h2>
          <p>{friend.targetSentence}</p>
          {friend.targetStatus === "invite pending" && (
            <button onClick={() => handleAcceptFriend(friend.targetName)}>Accept</button>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

export default Friends;