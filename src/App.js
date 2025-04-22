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


import React, { useState } from 'react';
import axios from 'axios';
import './gitfolioStyles.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);

  const fetchUser = async () => {
    try {
      const userRes = await axios.get(`https://api.github.com/users/${username}`);
      const repoRes = await axios.get(`https://api.github.com/users/${username}/repos`);
      setUserData(userRes.data);
      setRepos(repoRes.data);
    } catch (err) {
      alert('User not found!');
      setUserData(null);
      setRepos([]);
    }
  };

  return (
    // <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial' }}>
    <div className = "container">
      <h1>GitFolio</h1>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />
      <button onClick={fetchUser}>Search</button>

      {userData && (
        <div style={{ marginTop: '2rem' }}>
          <img src={userData.avatar_url} width="100" alt="avatar" />
          <h2>{userData.name}</h2>
          <p>{userData.bio}</p>
          <h3>Public Repos:</h3>
          <ul>
            {repos.map(repo => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
