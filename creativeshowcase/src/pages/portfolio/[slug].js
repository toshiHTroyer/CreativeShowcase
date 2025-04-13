// pages/portfolio/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PortfolioHeader from '../../components/PortfolioHeader';

export default function PublicPortfolio() {
  const { query } = useRouter(); // Accessing dynamic segment/ query.slug
  const [portfolio, setPortfolio] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Authenticated user
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Runs every time the slug is available in URL
  // Fetch data inside useEffect() when trying to access the data only on the client side
  // Using useEffect() & browser fetch() API to fetch: Portfolio data & Session data via /api/me
  useEffect(() => {
    async function fetchData() {
      if (!query.slug) return;

      try {
        // Fetching portfolio and user data in parallel
        const [portfolioRes, userRes] = await Promise.all([
          fetch(`/api/portfolio?slug=${query.slug}`),
          fetch('/api/me')
        ]);

        const portfolioData = await portfolioRes.json();
        const userData = await userRes.json();

        if (portfolioData.error) {
          setError(portfolioData.error);
          return;
        }

        setPortfolio(portfolioData.portfolio);
        setCurrentUser(userData.user || null);
      } catch {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query.slug]); // ensures this effect runs once slug is available

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
    <div>
      {/* Shared header across pages */}
      <PortfolioHeader
        userName={portfolio.user.userName}
        specialty={portfolio.specialty}
        isOwner={isOwner}
        currentPage="portfolio"
      />

      {/* Categories and Projects */}
      {portfolio.categories?.length > 0 ? (
        portfolio.categories.map(cat => (
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
  );
}

// User gets different view of portfolios depending on if they are the owner or not
// Users cannot see private portfolios that they do not own
