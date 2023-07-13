import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function SearchResult({ authenticated, setAuthenticated, username, setUsername, password, setPassword }){
   const navigate=useNavigate()
   const [searchParams] = useSearchParams();
   const[posts,setPosts]=useState([]);
   const {
    searchtext
  } = Object.fromEntries(searchParams.entries());
   useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = {
          searchtext
        };
        const response = await axios.post('http://localhost:8000/api/searchposts', formData);
        console.log("responseive????"+response.data[0])
        console.log("responseive????"+ response.data.length)
        console.log("responseive????"+ Object.values(response.data))
        setPosts(response.data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
  
    const intervalId = setInterval(fetchData, 100);
  
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
export default SearchResult;