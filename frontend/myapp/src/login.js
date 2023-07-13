import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate, Routes } from 'react-router-dom';
import './login.css';
import logo from "./twitter-logo.png";
import axios from 'axios';
import Navigations from "./navigations"
import Posts from "./posts"
import Friends from "./friends"
import Profile from "./profile"
import { useNavigate } from 'react-router-dom';
import MyPostHistory from './MyPosthistory';
import PostDetail from './postDetail'
import Favorites from './favorites'
import FPost from "./FPost"
import SearchResult from './searchresult';
import TrendingPosts from './TrendingPosts';
function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to="/" />
        )
      }
    />
  );
}

function LoginForm({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {

  const navigate = useNavigate();
  const handleFormSubmit = (event) => {
    console.log(authenticated)
    console.log("handle!@!!!!!!!!")
    event.preventDefault();
    console.log(username);
    console.log(password);
    const formData = {
      username,
      password
    };
    console.log("fetch called!!!!!");
    axios
      .post('http://localhost:8000/api/login', formData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        console.log(typeof response.data)
        console.log(authenticated)
        if(response.data.includes("failed")){
           console.log(response.data)
           window.location.reload()
           alert("Log In failed! Please Check your credentials or register a new one!!!!")
           sessionStorage.setItem('authenticated','false');
           setAuthenticated(false);
        }else{
           console.log("success!!!!!!")
           sessionStorage.setItem('authenticated','true');
           sessionStorage.setItem('username',username);
           sessionStorage.setItem('password',password);
           console.log(authenticated)
           setAuthenticated(true)
           navigate('/Navigations');
        }
        console.log({authenticated})
      })
      .catch((error) => {
        // Handle any errors
        // console.error(error);
      });
  };

  const handleUsernameChange = (event) => {
    console.log(event.target.value);
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    console.log(event.target.value);
    setPassword(event.target.value);
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <h1 className="head">Welcome to our Social Note!!!!!!!!!</h1>
      <img className="tlogo" src={logo} alt="hello" />
      <h2 className="bgimage"></h2>
      <h2 className="reminder">Please Log In Before Use</h2>
      <h3 className="UserName">UserName</h3>
      <input
        type="text"
        onChange={handleUsernameChange}
        className="nameinput"
        placeholder="Enter your username"
      />
      <h4 className="PassWord">PassWord</h4>
      <input
        type="password"
        onChange={handlePasswordChange}
        className="passwordinput"
        placeholder="Enter your password"
      />
      <h4>
        <button type="submit" className="loginbtn">
          Log In
        </button>
      </h4>
      <Link to="/register" className="registerbtn">Register</Link>
    </form>
  );
}

function RegisterPage({ authenticated, setAuthenticated, username, setUsername, password, setPassword }) {
  const navigate = useNavigate();
  const handleRegister = (event) => {
    // console.log(authenticated)
    // console.log("handle!@!!!!!!!!")
    event.preventDefault();
    // console.log(username);
    // console.log(password);
    const formData = {
      username: username,
      password:password
    };
    console.log("fetch called!!!!!");
    axios
      .post('http://localhost:8000/api/register', formData)
      .then((response) => {
        // Handle the response
        console.log(response.data);
        console.log(typeof response.data)
        if(response.data.includes("failed")){
          window.location.reload()
          alert("register failed! Your account credentials may be taken before. Please register with a new one!")
        }else{
          navigate('/login');
        }
      })
      .catch((error) => {
        // Handle any errors
        // console.error(error);
      });
  };
  const handleUsernameChange = (event) => {
    console.log(event.target.value);
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    console.log(event.target.value);
    setPassword(event.target.value);
  };
  return (
    <form onSubmit={handleRegister}>
      <h1 className="more">Tell Us More About You!</h1>
      <h2 className="uname">UserName</h2>
      <input className="uinput" type="text" onChange={handleUsernameChange}/>
      <h2 className="password">PassWord</h2>
      <input className="pinput" type="text" onChange={handlePasswordChange}/>
     <h2><input type="submit" className="submitbtn"/></h2>
    </form>
  );
}

function Login() {
  const [authenticated, setAuthenticated] = useState(false);
   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Router>
      <div className="welcome">
        <Routes>
          <Route exact path="/login" element={<LoginForm authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}>
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/register" element={<RegisterPage authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}>
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          
          <Route exact path="/Navigations"  element={<Navigations authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/posts"  element={<Posts authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/profile"  element={<Profile authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/friends"  element={<Friends authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/myposthistory"  element={<MyPostHistory authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/postDetail"  element={<PostDetail authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/viewFavorites"  element={<Favorites authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/fPost"  element={<FPost authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/searchresult"  element={<SearchResult authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
          <Route exact path="/trendingposts"  element={<TrendingPosts authenticated={authenticated} setAuthenticated={setAuthenticated} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>}> 
            {/* <LoginForm handleFormSubmit={handleFormSubmit} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} /> */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default Login;