import { useNavigate, useNavigation, useParams, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function TrendingPosts({ authenticated, setAuthenticated, username, setUsername, password, setPassword }){
    const[posts,setPosts]=useState([])
    const navigate=useNavigate();
    useEffect(() => {
        const fetchData = async () => {
          try {
            var searchtext="hello";
            const formData = {
              searchtext
            };
            const response = await axios.post('http://localhost:8000/api/trendingposts', formData);
            setPosts(response.data);
          } catch (error) {
            console.log("Error:", error);
          }
        };
      
        const intervalId = setInterval(fetchData, 50);
      
        // Clean up the interval when the component is unmounted or the effect is re-executed
        return () => clearInterval(intervalId);
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
      return(
        <div>
           {posts.map((item, index) => {
        return (
          <div key={index}>
            <h2>{item.postername}<button className="seeProfile" >See Posts History</button></h2>
            <p>{item.posttext}</p>
            <button type="button" >Likes: {item.likes}</button>
            <button type="button" >Favorites: {item.favorites}</button>
            <button type="button">View Comments</button>
            <h2>PostTime: {item.posttime.toString()}</h2>
          </div>
        );
      })}
        </div>
      )
}
export default TrendingPosts