import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PortfolioHeader from '../../components/PortfolioHeader';


export default function PublicPortfolio() {
  const { query, reload } = useRouter();
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

  async function handleDeleteCategory(id) {
    const confirmed = confirm('Are you sure you want to delete this category?');
    //confirm like alert
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        location.reload();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (e) {
      alert('An error occurred');
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!portfolio) return <div className="p-6 text-center text-gray-500">Portfolio does not exist.</div>;

  const isOwner = currentUser?.userName === portfolio.user.userName;
  const isPublic = portfolio.portfolioSettings?.isPublic;

  if (!isPublic && !isOwner) {
    return <div className="p-6 text-center text-gray-500">This portfolio is private.</div>;
  }

  return (
    <div className="bg-[#f7fcfa] min-h-screen">
      {/* light green background, ensures page fills screen height */}
      <PortfolioHeader userName={portfolio.user.userName} isOwner={true}/>

      <div className="flex max-w-7xl mx-auto px-4 py-10 gap-8">
        {/* flex layout for sidebar/bio + main content, mx-auto centers the whole row */}
        <aside className="w-64 shrink-0 top-24 h-fit bg-white border border-gray-300 rounded-xl shadow-lg p-4">
          {/* h-fit allows height to match content, fixed width sidebar (w-64), won't shrink on flex shrink*/}
          <div className="w-35 h-35 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={portfolio.bioImage || '/default-profile.png'}
              className="w-full h-full object-cover rounded-full"
            />
            {/* circular via rounded-full */}
          </div>

          <h2 className="text-center font-semibold text-lg text-gray-800 mb-2">
            {portfolio.user.userName}
          </h2>

          <div className="flex justify-center items-center gap-x-3 mb-4">
            {portfolio.links?.website && (
              <a href={portfolio.links.website} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-800 hover:underline">Website</a>
            )}
            {portfolio.links?.linkedin && (
              <a href={portfolio.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-800 hover:underline">LinkedIn</a>
            )} {/*Open link in a new browser tab w target, rel for security risks & performance */}
            {portfolio.links?.instagram && (
              <a href={portfolio.links.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-800 hover:underline">Instagram</a>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {portfolio.bio || 'No bio yet. Click Edit Portfolio to add one!'}
          </p>
        </aside>

        <main className="flex-1">
          {portfolio.categories?.length > 0 ? (
            portfolio.categories.map(cat => (
              <section key={cat._id} className="relative bg-white border border-gray-300 rounded-xl shadow-lg mb-8 p-6 transition hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                  {/* row layout: title left, delete button right */}
                  <h2 className="text-xl font-semibold text-emerald-700">{cat.name}</h2>
                  {isOwner && (
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-xs bottom-0 text-red-600 border border-red-600 px-1 py-1 rounded hover:bg-red-50"
                    >
                      Delete Category
                    </button>
                  )}
                </div> {/* bulleted list with left padding */}
                {cat.projects?.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {cat.projects.map((proj, i) => (
                      <li key={i} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">{proj.title}</h3>

                        {proj.projectContent?.contentType === 'image' && (
                          <div className="flex justify-center">
                            <img
                              src={proj.projectContent.content}
                              alt={proj.title}
                              className="max-w-sm w-full h-auto rounded-md shadow-md border border-gray-300"
                            />
                          </div>
                        )}

                        {proj.projectContent?.contentType === 'pdf' && (
                          <div className="flex justify-center">
                            <iframe
                              src={proj.projectContent.content}
                              title={proj.title}
                              width="100%"
                              height="500px"
                              className="rounded-md shadow-md border border-gray-300"
                            ></iframe>
                          </div>
                        )}

                        {proj.projectContent?.caption && (
                          <p className="text-center italic text-gray-600">{proj.projectContent.caption}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic"> No projects yet in this category.</p>
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
