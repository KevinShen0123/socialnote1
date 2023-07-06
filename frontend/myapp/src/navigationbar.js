import React from 'react';
import { Link } from 'react-router-dom';
function NavigationBar() {
  return (
    <nav>
      <div className="nav-links">
        <Link to="/profile">Your profile</Link>
        <Link to="/posts">Moments</Link>
        <Link to="/friends">Friends</Link>
      </div>
    </nav>
  );
}
export default NavigationBar;