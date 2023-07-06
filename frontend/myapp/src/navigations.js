import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
import './login.css';
import logo from "./twitter-logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './navigationbar';
function Navigations({ authenticated, setAuthenticated, username, setUsername, password, setPassword }){
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
      return(
        <div>
           <NavigationBar />
            hello page!
        </div>
      )
}
export default Navigations