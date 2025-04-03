import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PublicPortfolio() {
  const { query } = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPortfolio() {
      if (!query.slug) return;
      try {
        const res = await fetch(`/api/portfolio?slug=${query.slug}`);
        const data = await res.json();
        data.error ? setError(data.error) : setPortfolio(data.portfolio);
      } catch {
        setError('Something went wrong');
      }
    }
    fetchPortfolio();
  }, [query.slug]);

  if (error) return <p>{error}</p>;
  if (!portfolio) return <p> Portfolio Does not Exist </p>;

  return (
    <div>
      <h1>Portfolio: {portfolio.user.userName}</h1>
      <p>Specialty: {portfolio.specialty}</p>
      <form action="/api/logout" method="POST">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}