import React from 'react';
import Logo from './Logo'; // Import the Logo component
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const navigate = useNavigate();
    const handleSignInClick = () => {
        navigate('/Signin'); // Programmatically navigate to the /sign-in route
    };
    const handleMoviesClick = () => {
       navigate('/Movies');
    }
    const handleMusicClick = () => {
      navigate('/Music');
   }

  return (
    <div className="App">
      <Logo />
      <button onClick={handleSignInClick} className="sign-in-button">
          Sign In
      </button>
      <div className="content">
        <h1>Welcome to the Homepage</h1>
      </div>
        <div className="buttons-container">
        <button onClick={handleMoviesClick} className="button">Movies</button>
        <button onClick={handleMusicClick} className="button">Music</button>
      </div>
    </div>
  )
}

export default HomePage