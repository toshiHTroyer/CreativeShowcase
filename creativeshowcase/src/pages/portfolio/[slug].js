import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PortfolioHeader from '../../components/PortfolioHeader';

export default function PublicPortfolio() {
  const { query } = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!query.slug) return;

      try {
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
  }, [query.slug]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!portfolio) return <div className="p-6 text-center text-gray-500">Portfolio does not exist.</div>;

  const isOwner = currentUser?.userName === portfolio.user.userName;
  const isPublic = portfolio.portfolioSettings?.isPublic;

  if (!isPublic && !isOwner) {
    return <div className="p-6 text-center text-gray-500">This portfolio is private.</div>;
  }

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <PortfolioHeader
        isOwner={isOwner}
        userName={portfolio.user.userName}
      />
  
      {/* Two-column layout */}
      <div className="flex max-w-7xl mx-auto px-4 py-10 gap-8">
        {/* LEFT: Sticky Bio Sidebar */}
        <aside className="w-64 shrink-0 sticky top-24 h-fit bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          {/* Placeholder profile image */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://via.placeholder.com/96"
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
  
          {/* Placeholder user name */}
          <h2 className="text-center font-semibold text-lg text-gray-800 mb-2">
            {portfolio.user.userName}
          </h2>
  
          {/* Placeholder bio */}
          <p className="text-sm text-gray-600 text-center mb-4">
            Creative enthusiast. Passionate about design and technology.
          </p>
  
          {/* Placeholder links */}
          <div className="flex justify-center gap-3">
            <a href="https://github.com/toshiHTroyer" className="text-sm text-indigo-600 hover:underline">Website</a>
            <a href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_nav-header-signin" className="text-sm text-indigo-600 hover:underline">LinkedIn</a>
          </div>
        </aside>
  
        {/* RIGHT: Categories and Projects */}
        <main className="flex-1">
          {portfolio.categories?.length > 0 ? (
            portfolio.categories.map(cat => (
              <section
                key={cat._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 p-6 transition hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-indigo-700 mb-4">{cat.name}</h2>
  
                {cat.projects?.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {cat.projects.map((proj, i) => (
                      <li key={i} className="text-gray-700 text-sm">{proj.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No projects yet in this category.</p>
                )}
              </section>
            ))
          ) : (
            <div className="text-center text-gray-600 italic"> No categories.</div>
          )}
        </main>
      </div>
    </div>
  );
}
