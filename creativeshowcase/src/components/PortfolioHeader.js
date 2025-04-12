import Link from 'next/link';

export default function PortfolioHeader({ userName, isOwner, page = 'portfolio' }) {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        {/* Left Side */}
        <div className="top-bar-left">
          {page === 'portfolio' && isOwner && (
            <>
              <Link href="/portfolio/category"><button>Add Category</button></Link>
              <Link href="/portfolio/project"><button>Add Project</button></Link>
            </>
          )}
          {page !== 'portfolio' && (
            <Link href={`/portfolio/${userName}`}><button>← Back to Portfolio</button></Link>
          )}
        </div>

        {/* Center Text */}
        <div className="portfolio-text">
          <h1 className="portfolio-title">Portfolio: {userName}</h1>
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
