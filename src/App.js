// ... imports remain the same

function App() {
  // ... states and refs

  // Focus on input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Persist dark mode on body and html
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // ... fetchUser remains the same

  return (
    <div className={darkMode ? 'dark-mode full-page-wrapper' : 'full-page-wrapper'}>
      <div className="container">
        <h1>GitFolio</h1>

        {/* 🔄 Dark mode toggle */}
        <div className="toggle-wrapper">
          <label className="switch" aria-label="Toggle dark mode">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
          <span style={{ marginLeft: '0.5rem' }}>{darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}</span>
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
            {loading && <>
              <ClipLoader color="#0366d6" />
              <p role="status" style={{ marginTop: '1rem', color: '#666' }}>Loading...</p>
            </>}

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

        <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
          Built by Anthony Lewallen © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}


export default App;

