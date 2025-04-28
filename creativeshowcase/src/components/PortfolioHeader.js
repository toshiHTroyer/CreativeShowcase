import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PortfolioHeader({ isOwner, userName }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    }
    fetchCurrentUser();
  }, []);

  const portfolioUrl = currentUser ? `/portfolio/${currentUser.userName}` : '/';

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* max-w-7xl for responsive width, mx-auto for centering, px-6/py-4 for padding, flex for layout, items-center for vertical alignment, justify-between for spacing between elements*/}
        <Link
          href={portfolioUrl}
          className="text-2xl font-bold text-emerald-700 tracking-tight"
        >
          Creative Showcase
        </Link>

        {/* buttons, flex row setup*/}
        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <Link
                href="/portfolio/category"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#f0fbf7] border border-green-600 rounded-md hover:bg-green-100 transition"
              >
                Add a Category
              </Link>
              <Link
                href="/portfolio/project"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#f0fbf7] border border-green-600 rounded-md hover:bg-green-300 transition"
              >
                Add a Project
              </Link>

              <Link
                href="/portfolio/settings"
                className="px-4 py-2 text-sm font-medium bg-[#f0fbf7] text-gray-700 bg-[#f0fbf7] border border-green-600 rounded-md hover:bg-green-300 transition"
              >
                Portfolio Settings
              </Link>
            </>
          )}

          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-gray-700 border bg-[#f0fbf7] border-green-600 rounded-md hover:bg-green-300 transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
