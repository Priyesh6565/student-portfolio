import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.github.com/users/BHARGAVRATHOD07/repos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub repositories.");
        }
        return response.json();
      })
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className="card">
      <h2>My GitHub Repositories</h2>

      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <ul className="repo-list">
          {repos.map((repo) => (
            <li key={repo.id} className="repo-item">
              <h3>{repo.name}</h3>

              <p>
                ⭐ Stars: {repo.stargazers_count} &nbsp; | &nbsp;
                🍴 Forks: {repo.forks_count}
              </p>

              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
              >
                View Repository
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Projects;