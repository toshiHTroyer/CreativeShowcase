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

  if (!user) return <div className="p-6 text-center text-gray-500">Loading user info...</div>;

  return (
    <div className="bg-[#f7fcfa] min-h-screen h-screen overflow-hidden">
      <PortfolioHeader userName={user.userName} isOwner={true} page="category" />

      <div className="max-w-4xl mx-auto py-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h1 className="text-2xl font-semibold text-emerald-700 text-center mb-6">Add a New Category</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Category Title"
                disabled={submitting}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-300 transition"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}