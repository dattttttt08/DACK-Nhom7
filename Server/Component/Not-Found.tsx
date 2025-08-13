import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
        backgroundColor: '#f4f4f4',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '100px', color: '#B12C00' }}>404</h1>
        <p style={{ fontSize: '20px' }}>Page Not Found</p>
        <p style={{ fontSize: '20px' }}>                                                                        
          Go back to <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Home</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;