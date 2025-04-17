import { useState } from 'react';
import { useRouter } from 'next/router';
import PublicHeader from '@/components/PublicHeader';

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
//tailwind.css implementation here directly in markup
return (
  <div className="flex flex-col h-screen overflow-hidden">
    <PublicHeader />
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center items-center bg-[#f6f6ff] px-4">
      <div className="top-5 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-600 font-sans mb-6">
          Welcome to your Creative Community
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-purple-400 rounded-xl p-8 shadow-md max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-6 font-sans text-[#171717]">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button type="submit" className="w-full font-bold">Login</button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/register" className="underline text-purple-700 hover:text-purple-900">
            Register
          </a>
        </p>
      </form>
    </div>
  </div>
);
}
