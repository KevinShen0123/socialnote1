import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
import './profile.css';
import logo from "./twitter-logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {
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
  const handleFormSubmit = (event) => {
   //send new password to backend
   event.preventDefault();
   var input1=document.getElementsByClassName("pinput")[0];
   var ptag=document.getElementsByClassName("password")[0];
   if(input1.style.visibility=='visible'){
     const newpassword=input1.value;
     console.log("new password here?"+newpassword)
     const formData={
      username,
      newpassword
     }
     axios
     .post('http://localhost:8000/api/updatepassword', formData)
     .then((response) => {
       // Handle the response
       sessionStorage.setItem('password',newpassword)
       console.log(response.data);
       ptag.innerHTML="password:"+input1.value;
       input1.style.visibility='hidden';
       console.log(typeof response.data)
     })
     .catch((error) => {
       // Handle any errors
       // console.error(error);
     });
   }
  };
  const handlePasswordClick = (event) => {
    event.preventDefault();
    var input1=document.getElementsByClassName("pinput")[0];
    input1.style.visibility='visible';
  };
  const handleSignatureClick = (event) => {
    event.preventDefault();
    var input2=document.getElementsByClassName("sinput")[0];
    input2.style.visibility='visible';
  };
  const handleViewHistory = (event) => {
    event.preventDefault();
    navigate('/myposthistory');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h1 className="uname">username</h1>
      {/* <h1 className="username">{username}</h1> */}
      {/* <input type="text" className="username" placeholder={username}/> */}
      <h1 className="username">{sessionStorage.getItem('username')}</h1>
      <h1 className="password">password:{sessionStorage.getItem('password')}</h1>
      <button type="button" className="passwordmodify"  onClick={handlePasswordClick}>Modify Password</button>
      <input style={{ visibility: 'hidden' }} className="pinput" type="text" placeholder='what is your new password?' />
      {/* <input type="text" className="password" placeholder={password}/> */}
      <h1 className="signature">signature:you have no signatures</h1>
      <button type="button" className="signaturemodify" onClick={handleSignatureClick}>Modify Signature</button>
      <input style={{ visibility: 'hidden' }} className="sinput" type="text" placeholder='what is your new signature?' />
      <input type="submit" text="submit profile modification"/>
      <button type="button" onClick={handleViewHistory}>View My Post History</button>
    </form>
  );
}

export default Profile;