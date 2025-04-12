import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function addCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => { 
        async function fetchUser(){
            const res = await fetch('/api/me');
            const data = await res.json();
            if (!data.user) return router.push('/');
            setUser(data.user);
        }
        fetchUser();
    }, []);

    async function handleSubmit(e){
        e.preventDefault();
        const res = await fetch ('/api/category', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryName }),
            credentials: 'include',
        });

        const data = await res.json();
        if (res.ok){
            setTimeout(() => {
                router.push(`/portfolio/${user.userName}`);
            }, 1000);
            setError('');
            setCategoryName('');
        } else {
            setError(data.error || 'Failed to Create Category');
        }
    }

    if (!user) return <p>Loading user info...</p>;

    return (
        <div>
            <h1>Add Category - {user.userName}</h1>
            <a href={`/portfolio/${user.userName}`}> Back to Portfolio</a>
            <form onSubmit={handleSubmit}>
                <label>
                    Category Name:
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter Category Title*"
                    />
                </label>
                <br />
                {error && <p>{error}</p>}
                {message && <p>{message}</p>}
                <button type="submit">Save Category</button>
            </form>
        </div>
    )



    




}