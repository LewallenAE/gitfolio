// This code is a simple React application that allows users to search for GitHub users and view their public repositories.
// It uses the GitHub API to fetch user data and repositories based on the username entered in the input field.
// The application consists of a single component, App, which maintains the state for the username, user data, and repositories.
// The fetchUser function is called when the user clicks the "Search" button, making API calls to retrieve user information and repositories.
// The user data and repositories are displayed conditionally based on whether the user exists or not.
// The application is styled with inline CSS for simplicity, and it uses the axios library for making HTTP requests.
// The code is structured to be easy to read and understand, with clear separation of concerns for fetching data and rendering the UI.
// The application is designed to be user-friendly, providing feedback when a user is not found and displaying relevant information when a user is successfully retrieved.
// The code is a good starting point for building a more complex GitHub profile viewer or portfolio application.
// It can be further enhanced with additional features such as error handling, loading states, and improved styling.


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import './gitfolioStyles.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [error, setError] = useState('');


  
useEffect(() => {
  inputRef.current?.focus();
}, []);

  const getInitialTheme = () => {
  const saved = localStorage.getItem('darkMode');
  return saved === 'true';
};
 const [darkMode, setDarkMode] = useState(getInitialTheme);
  
  const toggleDarkMode = () => {
  setDarkMode(prev => {
    localStorage.setItem('darkMode', !prev);
    return !prev;
  });
};


  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const userRes = await axios.get(`https://api.github.com/users/${username}`);
      const repoRes = await axios.get(`https://api.github.com/users/${username}/repos`);
      setUserData(userRes.data);
      setRepos(repoRes.data);
    } catch (err) {
      setError('User not found. Please check the username and try again.');
      setUserData(null);
      setRepos([]);
    } finally {
      setLoading(false);
  }
  };   
  


  return (
    // <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial' }}>
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>GitFolio</h1>
      <button onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
     {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
   </button>

     <main>
     <form onSubmit={(e) => {
  e.preventDefault(); // Prevents page reload
  fetchUser();        // Triggers search
}}>
     
  <input
    ref={inputRef}
    type="text"
    value={username}
    onChange={e => setUsername(e.target.value)}
    placeholder="Enter GitHub username"
    aria-label="GitHub username"
  />
  <button type="submit">Search</button>
</form>
{error && <p className="status-message" role="alert">{error}</p>}

         
    {loading && <ClipLoader color="#0366d6" />}
    {loading && <p role="status" style={{ marginTop: '1rem', color: '#666' }}>Loading...</p>}
          
        {!userData && (
  <p className="status-message">Search for a GitHub user to see profile and repositories.</p>
)}

      {userData && (
        <div style={{ marginTop: '2rem' }}>
          <img src={userData.avatar_url} width="100" alt="avatar" />
          <h2>{userData.name}</h2>
          <p>{userData.bio}</p>
          <h3>Public Repos:</h3>
        {userData && repos.length === 0 && (
  <p role ="status" style={{ marginTop: '1rem', color: '#999' }}>No public repositories found.</p>
)}
          <ul>
              {repos.map(repo => (
                <li key={repo.id} className="repo-card">
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  <p>{repo.description || 'No description'}</p>
                  <p className="language-tag">{repo.language || 'Unknown'}</p>
                         <p className="last-updated">
  Last updated: {new Date(repo.updated_at).toLocaleDateString()}
</p>
                </li>
              ))}
          </ul>


            
        </div>
      )}
</main>

{/* Footer */}
        <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
  Built by Anthony Lewallen © {new Date().getFullYear()}

</footer>
    </div>
  );
}



export default App;
