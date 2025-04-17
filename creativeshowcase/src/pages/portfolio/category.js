import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PortfolioHeader from '../../components/PortfolioHeader';

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/me');
      const data = await res.json();
      if (!data.user) return router.push('/');
      setUser(data.user);
    }
    fetchUser();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || !categoryName.trim()) return;
    setSubmitting(true);

    const res = await fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: categoryName }),
      credentials: 'include',
    });

    const data = await res.json();
    if (res.ok) {
      setCategoryName('');
      router.push(`/portfolio/${user.userName}`);
    } else {
      setError(data.error || 'Failed to Create Category');
      setSubmitting(false);
    }
  }

  if (!user) return <p>Loading user info...</p>;

  return (
    <div>
      <PortfolioHeader userName={user.userName} isOwner={true} page="category" />
      <form onSubmit={handleSubmit}>
        <label>
          Category Name:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter Category Title*"
            disabled={submitting}
          />
        </label>
        <br />
        {error && <p>{error}</p>}
        <button type="submit" disabled={submitting}>Save Category</button>
      </form>
    </div>
  );
}