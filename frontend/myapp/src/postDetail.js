import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const mongoose = require('mongoose')
function PostDetail({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const[comments,setComments]=useState([]);
  console.log("hhhhhhh")
  console.log(authenticated)
  console.log("YYYYYYY")
  const {
    index,
    postername,
    posttext,
    likes,
    favorites,
    posttime,
    likers,
    favoriters,
    comments
  } = Object.fromEntries(searchParams.entries());
  // console.log(JSON.parse(commentsParam))
  // const comments = commentsParam ? commentsParam : [];
  const  comments2=JSON.parse(comments);
  const[commentss,setCommentss]=useState(JSON.parse(comments));
  console.log("plane")
  console.log(typeof comments)
  console.log(comments)
  console.log("car")
    const formData={
      index
    }
  // Clean up any resources if necessary
  // // console.log("comments is"+comments.commentator)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = {
          index
        };
        const response = await axios.post('http://localhost:8000/api/addreadpostcomments', formData);
        setCommentss(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
  
    const intervalId = setInterval(fetchData, 500);
  
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
  function handleComments() {
    console.log("check start");
    var carea = document.getElementsByClassName('ctext')[0];
    var commentator = sessionStorage.getItem('username');
    var ctime = new Date();
    var ctext = carea.value;
  
    const formData = {
      commentator,
      ctext,
      ctime,
      index
    };
  
    console.log("correct before sent!!!!!!!!!!");
  
    axios
      .post('http://localhost:8000/api/addcomments', formData)
      .then((response) => {
        // Handle the response
        console.log("successComment!!!!!!!!!!!");
  
        // Create a new comment object
        const newComment = {
          commentator,
          ctime,
          ctext
        };
        // Update the state with the new comment
        setCommentss(prevComments => [...prevComments, newComment]);
        console.log("cslength?"+commentss.length)
        window.location.reload();
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
      {commentss.map((itemc, index) => (
        <div key={index}>
           <h2 className="ctatorname">{itemc.commentator}</h2>
          <h2 className="mycomments">{itemc.ctext}</h2>
          <h2 className="mycommentsTime">{itemc.cTime}</h2>
          <button className="replycomments" onClick={handleReply}>Reply</button>
        </div>
      ))}
    </div>
  );
}

export default PostDetail;