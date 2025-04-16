import { useState } from 'react';
import { useRouter } from 'next/router';
import PublicHeader from '@/components/PublicHeader';
//renders registration form and sends a POST request to the backend when the user submits the form
//Collects user input (username, email, password, etc.) Then on form submission, sends a POST request to /api/register
// & passes JSON in request body which is sent with the fetch() call
export default function Register() {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    focus: '',
    isPublic: true,
  });
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST', // Use POST to send form data to API route
      headers: { 'Content-Type': 'application/json' }, //req.body will be parsed as JSON
      body: JSON.stringify(form), // api route can access parsed body via req.body
      credentials: 'include'
    });

    const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : {};
    if (res.ok) { //After successful form POST, redirect using router.push 
      router.push(`/portfolio/${data.user.portfolioUrl}`);
    } else {
      setError(data.error || 'Registration failed.');
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
    <PublicHeader />
    <div className="relative min-h-screen flex items-center justify-center bg-[#f6f6ff] px-4">
      <div className="absolute top-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 font-sans tracking-wide">
          Create your Portfolio
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-purple-400 rounded-xl p-8 shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 font-sans text-[#171717]">Register</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          placeholder="Username"
          onChange={e => setForm({ ...form, userName: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          placeholder="Email"
          type="email"
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          placeholder="Focus (e.g. Film, Design)"
          onChange={e => setForm({ ...form, focus: e.target.value })}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={e => setForm({ ...form, isPublic: e.target.checked })}
            className="accent-purple-500"
          />
          Public Portfolio
        </label>

        <button type="submit" className="w-full font-bold">
          Register
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/" className="underline text-purple-700 hover:text-purple-900">
            Login
          </a>
        </p>
      </form>
    </div>
  </div>
  );
}
