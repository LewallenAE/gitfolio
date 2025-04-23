import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './gitfolioStyles.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark-mode full-page-wrapper' : 'full-page-wrapper'}>
      <div className="container">
        <h1>GitFolio</h1>

        {/* 🌗 Dark Mode Toggle */}
        <div className="toggle-wrapper">
          <label className="switch" aria-label="Toggle dark mode">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
          <span style={{ marginLeft: '0.5rem' }}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </span>
        </div>

        <main>
          <section aria-labelledby="profile-section">
            <h2 id="profile-section" className="visually-hidden">GitHub Profile Search</h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              fetchUser();
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
            {loading && (
              <>
                <ClipLoader color="#0366d6" />
                <p role="status" style={{ marginTop: '1rem', color: '#666' }}>Loading...</p>
              </>
            )}

            {!userData && !error && (
              <p className="status-message">Search for a GitHub user to see profile and repositories.</p>
            )}

            {userData && (
              <div style={{ marginTop: '2rem' }}>
                <img src={userData.avatar_url} width="100" alt="avatar" />
                <h2>{userData.name}</h2>
                <p>{userData.bio}</p>
                <h3>Public Repos:</h3>
                {repos.length === 0 && (
                  <p role="status" style={{ marginTop: '1rem', color: '#999' }}>
                    No public repositories found.
                  </p>
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
          </section>
        </main>

        {/* 👇 Footer */}
        <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
          Built by Anthony Lewallen © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

export default App;
