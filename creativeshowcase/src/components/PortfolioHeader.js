import Link from 'next/link';

export default function PortfolioHeader({ isOwner, userName }) {
  const portfolioUrl = `/portfolio/${userName}`;

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Brand Name links to user portfolio */}
        <Link
          href={portfolioUrl}
          className="text-2xl font-bold text-indigo-600 tracking-tight"
        >
          Creative Showcase
        </Link>

        {/* Right: Action Buttons (only if owner) */}
        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <Link
                href="/portfolio/category"
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Add a Category
              </Link>
              <Link
                href="/portfolio/project"
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Add a Project
              </Link>

              <Link
                href="/portfolio/settings"
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Edit Portfolio
              </Link>
            </>
          )}

          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
