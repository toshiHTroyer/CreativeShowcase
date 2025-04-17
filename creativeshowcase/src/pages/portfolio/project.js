import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortfolioHeader from '../../components/PortfolioHeader';

export default function AddProject() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const userRes = await fetch('/api/me');
      const userData = await userRes.json();
      if (!userData.user) return router.push('/');
      setUser(userData.user);

      const catRes = await fetch(`/api/portfolio?slug=${userData.user.userName}`);
      const catData = await catRes.json();
      if (catData.portfolio?.categories) {
        setCategories(catData.portfolio.categories);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedCategory || !projectTitle) return setError('All fields are required');
    if (submitting) return;

    setSubmitting(true);
    const res = await fetch('/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title: projectTitle, categoryId: selectedCategory }),
    });

    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      router.push(`/portfolio/${user.userName}`);
    } else {
      setError(data.error || 'Failed to add project');
    }
  }

  if (!user) return <p>Loading user...</p>;

  return (
    <div>
      <PortfolioHeader userName={user.userName} isOwner={true} page="project" />
      <form onSubmit={handleSubmit}>
        <label>
          Choose Category:
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} disabled={submitting}>
            <option value="">--Select--</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Project Title:
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Enter project name"
            disabled={submitting}
          />
        </label>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={submitting}>Save Project</button>
      </form>
    </div>
  );
}