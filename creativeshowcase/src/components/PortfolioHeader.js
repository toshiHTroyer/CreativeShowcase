import Link from 'next/link';

export default function PortfolioHeader({ userName, specialty, isOwner, page = 'portfolio' }) {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        {/* Left Side */}
        <div className="top-bar-left">
          {page === 'portfolio' && isOwner && (
            <>
              <a href="/portfolio/category">Add Category</a>
              <a href="/portfolio/project">Add Project</a>
            </>
          )}
          {page !== 'portfolio' && (
            <a href={`/portfolio/${userName}`}> Back to Portfolio </a>
          )}
        </div>

        {/* Center Text */}
        <div className="portfolio-text">
          <h1 className="portfolio-title"> {specialty} Portfolio: {userName}</h1>
        </div>

        {/* Right Side */}
        <div className="top-bar-right">
          {page === 'portfolio' && isOwner && <button>Edit Portfolio</button>}
          <form action="/api/logout" method="POST" style={{ display: 'inline' }}>
            <button type="submit">Logout</button>
          </form>
        </div>
      </div>
    </div>
  );
} 
