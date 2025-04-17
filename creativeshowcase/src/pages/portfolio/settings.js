import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PortfolioHeader from '../../components/PortfolioHeader';

export default function PortfolioSettings() {
  const [form, setForm] = useState({
    bio: '',
    links: {
      linkedin: '',
      website: '',
      instagram: ''
    },
    isPublic: true,
  });
  const [bioImageFile, setBioImageFile] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/me');
      const data = await res.json();
      if (!data.user) return router.push('/');
      setUser(data.user);

      const portfolioRes = await fetch(`/api/portfolio?slug=${data.user.userName}`);
      const portfolioData = await portfolioRes.json();
      if (portfolioData.portfolio) {
        setForm({
          bio: portfolioData.portfolio.bio || '',
          links: portfolioData.portfolio.links || {
            linkedin: '',
            website: '',
            instagram: '',
          },
          isPublic: portfolioData.portfolio.portfolioSettings?.isPublic ?? true,
        });
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    //formData required for multipart/form data (ie bio image upload)
    const formData = new FormData();
    formData.append('bio', form.bio);
    formData.append('linkedin', form.links.linkedin);
    formData.append('website', form.links.website);
    formData.append('instagram', form.links.instagram);
    if (bioImageFile) {
      formData.append('bioImage', bioImageFile);
    }
    formData.append('isPublic', form.isPublic.toString());
    const res = await fetch('/api/settings', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/portfolio/${user.userName}`);
    } else {
      setError(data.error || 'Update failed');
    }
  }

  function updateLink(platform, value) {
    setForm(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [platform]: value
      }
    }));
  }

  if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-[#f7fcfa] min-h-screen h-screen overflow-hidden">
      <PortfolioHeader userName={user.userName} isOwner={true} />

      <div className="max-w-4xl mx-auto py-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <h1 className="text-2xl font-semibold text-emerald-700 text-center mb-6">Edit Portfolio Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setBioImageFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={form.links.linkedin}
                onChange={e => updateLink('linkedin', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={form.links.website}
                onChange={e => updateLink('website', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="url"
                value={form.links.instagram}
                onChange={e => updateLink('instagram', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={form.isPublic}
                onChange={e => setForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="mr-2 accent-green-500"

              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Portfolio is Public
              </label>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-300 transition"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}