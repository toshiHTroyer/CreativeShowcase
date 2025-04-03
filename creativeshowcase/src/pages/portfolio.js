import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Portfolio() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const res = await fetch('/api/me');
      const data = await res.json();
      if (!data.user) router.push('/');
      else setUser(data.user);
    }
    loadUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Portfolio: {user.userName}</h1>
      <p>Email: {user.email}</p>
      <form action="/api/logout" method="POST">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}