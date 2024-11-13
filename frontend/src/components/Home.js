import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Home() {
  return (
    <div className="container">
      <Sidebar />
      <div style={{ width: '100%' }}>
        <Header />
        <div style={{ padding: '20px' }}>
          <h1>Welcome to ---</h1>
          <p>sdfkjsdfsfjdsf</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
