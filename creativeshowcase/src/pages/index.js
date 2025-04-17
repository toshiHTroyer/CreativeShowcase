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
  <div className="flex flex-col h-screen overflow-hidden font-sans">
    <PublicHeader />
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center items-center bg-[#f0fbf7]">
      {/*h-screen maks div height full view, flex-col for top-bottom, centers items in div, justify-center aligns items along the main axis (vertical in flex-col)   */}
      <div className="flex-1 flex items-start justify-center pt-16">
        {/*note text below and the login form/container are wrapped in their own flex containters to so they could be vertically adjusted indepentally of each other */}
        <h2 className="text-2xl md:text-4xl text-center font-sans font-bold text-green-800 text mb-6 tracking-wide">
          Welcome to your Creative Community
        </h2>
      </div>

      
      <div className = "flex-1 flex items-start justify-center mb-50 ">
        <form
          onSubmit={handleSubmit}
          className="bg-white border-4 border-green-700 rounded-xl p-15 shadow-md max-w-md w-full"
        >
          <h1 className="text-3xl font-bold font-sans text-center mb-6 font-sans text-emerald-700">Login</h1>

          {error && (
            <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
          )}

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 mb-4 border-2 border-green-600 bg-[#f0fbf7] rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 mb-4 border-2 border-green-600 bg-[#f0fbf7] rounded focus:outline-none focus:ring-2 focus:ring-lime-600"
          />
          <div className="text-center">
            <button type="submit" className="border-2 border-green-600 px-3 py-1 bg-[#f0fbf7] hover:bg-emerald-400 font-bold rounded">Login</button>
          </div>
          <p className="text-center mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-green-700 hover:text-green-900">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  </div>
);
}
