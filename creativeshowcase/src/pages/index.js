import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',

      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    });

    if (res.ok) {
      const { user } = await res.json();
      router.push(`/portfolio/${user.portfolioUrl}`);
    } else {
      setError('Login failed. Check your credentials.');
    }
  }

  return (
    
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} /><br/>
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /><br/>
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </form>
  );
}