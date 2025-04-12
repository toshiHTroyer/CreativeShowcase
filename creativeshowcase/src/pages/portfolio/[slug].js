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
    <div>
      <h1>Portfolio: {portfolio.user.userName}</h1>
      <h2>Specialty: {portfolio.specialty}</h2>

      {portfolio.categories?.length > 0 ? (
            portfolio.categories.map((cat) => (
              <div key={cat._id}>
                <h3>{cat.name}</h3>
                {cat.projects?.length > 0 ? (
                  <ul>
                    {cat.projects.map((proj, i) => (
                      <li key={i}>{proj.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No projects yet in this category.</p>
                )}
                <form> <a href="/portfolio/project"> <button type="button">Add Projects</button> </a> </form>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
      )}

      {isOwner ? (
        <div>
          <p>You are the owner of this portfolio.</p>

          <form> <a href="/portfolio/category"> <button type="button">Add a Category</button> </a> </form>
          <button>Edit Portfolio</button>
          <form action="/api/logout" method="POST">
            <button type="submit">Logout</button>
          </form>
        </div>
      ) : (
        <p>This is the public view.</p>
      )}
    </div>
  );
}
//user gets different view of portfolios depending on if they are the owner or not
//users cannot see private portfolios that they do not own