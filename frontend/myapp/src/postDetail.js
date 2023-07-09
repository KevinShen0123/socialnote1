import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const mongoose = require('mongoose')
function PostDetail({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const[comments,setComments]=useState([]);
  const {
    index,
    postername,
    posttext,
    likes,
    favorites,
    posttime,
    likers,
    favoriters,
  } = Object.fromEntries(searchParams.entries());
  // console.log(JSON.parse(commentsParam))
  // const comments = commentsParam ? commentsParam : [];
  const comments2=sessionStorage.getItem('comments')
  const comments=JSON.parse(comments2);
  // setComments(comments3)
  console.log("plane")
  console.log(typeof comments)
  console.log(comments)
  console.log("car")
  // console.log("comments is"+comments.commentator)
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
  function handleComments(){
    console.log("check start")
     var carea=document.getElementsByClassName('ctext')[0];
    //  carea.style.visibility="visible";
     //set comments content add comments 
     var commentator=sessionStorage.getItem('username');
     console.log("check start1")
     var ctime=new Date();
     console.log("check start3")
     var ctext=carea.value;
     console.log("check start4")
     console.log("check start2")
     const formData={
      commentator,
      ctext,
      ctime,
      index
     }
     console.log("correct before sent!!!!!!!!!!")
     axios
     .post('http://localhost:8000/api/addcomments', formData)
     .then((response) => {
       // Handle the response
       console.log("successComment!!!!!!!!!!!")
     })
     .catch((error) => {
       // Handle any errors
       // console.error(error);
     });

  }
  function handleReply(){
   console.log("Reply is Called!!!!!!!!!!!!!!!!!!!");
  }
  return (
    <div>
      <h2>{postername}</h2>
      <p>{posttext}</p>
      <button type="button">Likes: {likes}</button>
      <button type="button">Favorites: {favorites}</button>
      <h2>PostTime: {posttime.toString()}</h2>
      <h2>Comments:<button type="button" onClick={handleComments}>Add Comments</button></h2>
      <textarea className="ctext" ></textarea>
      {comments.map((itemc, index) => (
        <div key={index}>
           <h2 className="ctatorname">{itemc.commentator}</h2>
          <h2 className="mycomments">{itemc.ctext}</h2>
          <h2 className="mycommentsTime">{itemc.cTime}</h2>
          <button className="replycomments" onClick="handleReply">Reply</button>
        </div>
      ))}
    </div>
  );
}

export default PostDetail;