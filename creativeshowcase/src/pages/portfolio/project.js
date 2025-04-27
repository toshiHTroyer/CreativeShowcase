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

  if (!user) return <div className="p-6 text-center text-gray-500">Loading user info...</div>;

  return (
    <div className="bg-[#f7fcfa] min-h-screen h-screen overflow-hidden">
      <PortfolioHeader userName={user.userName} isOwner={true} page="project" />

      <div className="max-w-4xl mx-auto py-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h1 className="text-2xl font-semibold text-emerald-700 text-center mb-6">Add a New Project</h1>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={submitting}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">--Select--</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
                disabled={submitting}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Caption (optional)</label>
              <input
                type="text"
                value={projectCaption}
                onChange={(e) => setProjectCaption(e.target.value)}
                placeholder="Enter project caption"
                disabled={submitting}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (Image or PDF)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setProjectFile(e.target.files[0])}
                disabled={submitting}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            {submitting && <p className="text-center text-gray-500">Uploading... Please wait.</p>}

            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-300 transition"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}