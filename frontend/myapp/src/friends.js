import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
import './login.css';
import logo from "./twitter-logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Friends({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Authenticated value changed:', authenticated);
    // Perform actions based on the updated authenticated value
    if (localStorage.getItem('authenticated')) {
      console.log("authenticated!!!!!!!!!!!!!")
    } else {
      navigate("/login");
    }
  }, [localStorage.getItem('authenticated'), navigate]);

  return (
    <div>
      No friends!
    </div>
  );
}

export default Friends;