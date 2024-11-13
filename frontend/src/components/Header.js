import React from 'react';

function Header() {
  return (
    <div className="header">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="buttons">
        <button className="account-btn">Account</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </div>
  );
}

export default Header;
