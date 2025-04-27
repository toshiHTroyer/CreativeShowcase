// src/pages/portfolio/project.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortfolioHeader from '../../components/PortfolioHeader';

export default function AddProject() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCaption, setProjectCaption] = useState('');
  const [projectFile, setProjectFile] = useState(null);
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
    if (!selectedCategory || !projectTitle || !projectFile) {
      return setError('All fields (including file) are required');
    }
    if (submitting) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', projectTitle);
    formData.append('caption', projectCaption);
    formData.append('file', projectFile);
    formData.append('categoryId', selectedCategory);

    const res = await fetch('/api/project', {
      method: 'POST',
      body: formData,
      credentials: 'include',
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
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            placeholder="Enter project title"
            disabled={submitting}
          />
        </label>
        <br />
        <label>
          Project Caption (optional):
          <input
            type="text"
            value={projectCaption}
            onChange={(e) => setProjectCaption(e.target.value)}
            placeholder="Enter project caption"
            disabled={submitting}
          />
        </label>
        <br />
        <label>
          Upload File (Image, Video, or PDF):
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setProjectFile(e.target.files[0])}
            disabled={submitting}
          />
        </label>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={submitting}>Save Project</button>
      </form>
      {submitting && <p>Uploading... Please wait.</p>}
    </div>
  );
}