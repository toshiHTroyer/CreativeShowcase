import { useRouter } from 'next/router';
// Next.js Dynamic Routing: useRouter() gives access to the slug from the URL (/portfolio/[slug])
import { useEffect, useState } from 'react';
// React hooks for client-side state and side effects
import PortfolioHeader from '../../components/PortfolioHeader';

// Dynamic Nested Route: [slug] allows generating user-specific portfolio pages based on username.
// Next.js automatically maps this dynamic file to URLs like /portfolio/username.

export default function PublicPortfolio() {
  const { query, push } = useRouter();
  // Next.js useRouter() hook to access URL query parameters (slug)
  const [portfolio, setPortfolio] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [publicUsers, setPublicUsers] = useState([]);

  //runs every time the slug is available in URL
  //fetch data inside useEffect() when trying access the data only on the client side 
  // Client-Side Data Fetching with useEffect(), Fetch Portfolio & Session Data when URL slug is available
  useEffect(() => {
    async function fetchData() {
      if (!query.slug) return;

      try {
        const [portfolioRes, userRes, usersRes] = await Promise.all([
          fetch(`/api/portfolio?slug=${query.slug}`), // Next.js API Route: Fetching portfolio details dynamically based on slug
          fetch('/api/me'),
          // Next.js API Route: Fetching current session/user data
          fetch('/api/public-users'),
        ]);

        const portfolioData = await portfolioRes.json();
        const userData = await userRes.json();
        const usersData = await usersRes.json();

        if (portfolioData.error) {
          setError(portfolioData.error);
          return;
        }

        setPortfolio(portfolioData.portfolio);
        setCurrentUser(userData.user || null);
        setPublicUsers(usersData.users || []);
      } catch {
        setError('Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query.slug]); 
  // useEffect depends on query.slug

  async function handleDeleteCategory(id) {
    const confirmed = confirm('Are you sure you want to delete this category?');
    //confirm like alert
    if (!confirmed) return; // Browser-native confirm dialog

    try {
      const res = await fetch(`/api/category/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        location.reload();
        // Force reload to reflect deleted category
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
    <div className="bg-[#f0fbf7] min-h-screen">
      {/* light green background, ensures page fills screen height */}
      <PortfolioHeader userName={portfolio.user.userName} isOwner={true}/>

      <div className="flex max-w-7xl mx-auto px-4 py-10 gap-8">
        {/* flex layout for sidebar/bio + main content, mx-auto centers the whole row */}
        <aside className="w-64 shrink-0 h-fit flex flex-col gap-6">
          <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-4">
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

            <h3 className="text-center font-light text-sm text-gray-600 mb-4">
              {portfolio.specialty}
            </h3>

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
          </div>

          {!isOwner && currentUser && (
            <div className="mb-8 text-center">
              <button
                onClick={() => push(`/portfolio/${currentUser.userName}`)}
                className="text-sm font-medium text-emerald-700 border border-emerald-600 px-4 py-1 rounded hover:bg-emerald-100"
              >
                ← Back to My Portfolio
              </button>
            </div>
          )}
          {isOwner && publicUsers.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-4">
              <h3 className="text-md font-semibold text-emerald-700 mb-4 text-center">Explore Other Creatives</h3>

              <div className="space-y-4">
                {publicUsers
                  .filter(user => user.userName !== currentUser?.userName)
                  .map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-2 border border-gray-200 rounded-lg shadow hover:shadow-md transition"
                    >
                      <a href={`/portfolio/${user.url}`} className="flex-shrink-0">
                        <img
                          src={user.bioImage || '/default-profile.png'}
                          alt={user.userName}
                          className="w-14 h-14 object-cover rounded-full border"
                        />
                      </a>
                      <div className="flex-1">
                        <a href={`/portfolio/${user.url}`} className="font-semibold text-green-600 hover:underline block">
                          {user.userName}
                        </a>
                        <p className="text-xs text-gray-600">{user.specialty || 'No specialty listed'}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1">
          {portfolio.categories?.length > 0 ? (
            portfolio.categories.map(cat => (
              <section key={cat._id} className="relative bg-white border border-gray-300 rounded-xl shadow-lg mb-12 p-6 transition hover:shadow-md">
                <div className="flex justify-center items-center relative mb-6">
                  <h2 className="text-2xl font-semibold text-emerald-700 text-center">{cat.name}</h2>

                  {isOwner && (
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="absolute right-0 px-3 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {cat.projects?.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {cat.projects.map((proj, i) => (
                        <div key={i} className="bg-[#f7fcfa] border border-gray-300 rounded-xl shadow-md p-4 flex flex-col items-center">
                          <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">{proj.title}</h3>

                          {proj.projectContent?.contentType === 'image' && (
                            <div className="w-full flex justify-center mb-4">
                              <img
                                src={proj.projectContent.content}
                                alt={proj.title}
                                className="w-full max-w-md h-64 object-cover rounded-md shadow-sm border"
                              />
                            </div>
                          )}

                          {proj.projectContent?.contentType === 'pdf' && (
                            <div className="w-full flex justify-center mb-4">
                              <iframe
                                src={proj.projectContent.content}
                                title={proj.title}
                                width="100%"
                                height="250px"
                                className="rounded-md shadow-sm border"
                              ></iframe>
                            </div>
                          )}

                          {proj.projectContent?.caption && (
                            <p className="text-sm text-gray-600 w-full text-left">{proj.projectContent.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic"> No projects yet in this category.</p>
                )}
              </section>
            ))
          ) : (
            <div className="text-center text-gray-600 italic"> No categories yet.</div>
          )}
        </main>
      </div>
    </div>
  );
}
