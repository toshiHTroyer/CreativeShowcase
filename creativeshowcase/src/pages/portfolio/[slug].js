import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PublicPortfolio() {
  const { query } = useRouter(); //Accessing dynamic segment/ query.slug
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // Authenticated user
  const [loading, setLoading] = useState(true);

//runs every time the slug is available in URL
//fetch data inside useEffect() when trying access the data only on the client side 
//Using useEffect() & browser fetch() API to fetch: Portfolio data & Session data via /api/me
  useEffect(() => { 
    async function fetchData() {
      if (!query.slug) return;

      try {
        // Fetching the portfolio from route-based API: `/api/portfolio?slug=${query.slug}`
        const res = await fetch(`/api/portfolio?slug=${query.slug}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        setPortfolio(data.portfolio);

        // fetch the current authenticated user (if logged in)
        const meRes = await fetch('/api/me');
        const meData = await meRes.json();
        setCurrentUser(meData.user || null);
      } catch {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query.slug]); //ensures this effect runs once slug is available

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!portfolio) return <p>Portfolio Does Not Exist</p>;

  const isOwner = currentUser?.userName === portfolio.user.userName;
  const isPublic = portfolio.portfolioSettings?.isPublic;

  // If not public and not the owner, deny access
  if (!isPublic && !isOwner) {
    return <p>This portfolio is private.</p>;
  }

  return (
    <body>
      <div>
        {!isOwner && (
          <div className="public-view-notice">
            <p>This is the public view.</p>
            <p><a href={`/portfolio/${portfolio.user.userName}`}>Back to Portfolio</a></p>
          </div>
        )}
        <div className="top-bar">
          {!isOwner && (
            <div className="public-notice">
              <p>This is the public view.</p>
              <p><a href={`/portfolio/${portfolio.user.userName}`}>← Back to Portfolio</a></p>
            </div>
          )}

          <div className="top-bar-content">
            {/* Left buttons */}
            {isOwner && (
              <div className="top-bar-left">
                <a href="/portfolio/category"><button type="button">Add Category</button></a>
                <a href="/portfolio/project"><button type="button">Add Project</button></a>
              </div>
            )}

            {/* Centered text */}
            <div className="portfolio-text">
              <h1 className="portfolio-title">Portfolio: {portfolio.user.userName}</h1>
              <h2 className="portfolio-specialty">Specialty: {portfolio.specialty}</h2>
            </div>

            {/* Right buttons */}
            {isOwner && (
              <div className="top-bar-right">
                <button>Edit Portfolio</button>
                <form action="/api/logout" method="POST" style={{ display: 'inline' }}>
                  <button type="submit">Logout</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {portfolio.categories?.length > 0 ? (
              portfolio.categories.map((cat) => (
                <div key={cat._id} className="category-box">
                  <h3 className="category-title">{cat.name}</h3>
                  {cat.projects?.length > 0 ? (
                    <ul className="project-list">
                      {cat.projects.map((proj, i) => (
                        <li key={i} className="project-item">{proj.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-projects">No projects yet in this category.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No categories found.</p>
        )}
      </div>
    </body>
  );
}
//user gets different view of portfolios depending on if they are the owner or not
//users cannot see private portfolios that they do not own