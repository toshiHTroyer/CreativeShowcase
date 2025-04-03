import { useState } from 'react';
import { useRouter } from 'next/router';
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
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Username" onChange={e => setForm({ ...form, userName: e.target.value })} /><br/>
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /><br/>
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /><br/>
      <input placeholder="Focus (e.g. Film, Design)" onChange={e => setForm({ ...form, focus: e.target.value })} /><br/>
      <label>
        Public Portfolio:
        <input type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} />
      </label><br/>
      <button type="submit">Register</button>
    </form>
  );
}