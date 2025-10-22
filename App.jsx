import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './Auth.jsx'
import * as api from './Api.jsx'

function Nav({ onRoute }) {
  const { user, logout } = useAuth()
  return (
    <header className="nav">
      <div className="brand">Community</div>
      <nav className="nav-links">
        <button onClick={() => onRoute('home')}>Home</button>
        <button onClick={() => onRoute('feed')}>Feed</button>
        <button onClick={() => onRoute('create')}>Create</button>
      </nav>
      <div className="nav-right">
        {user ? (
          <>
            <span className="username">Hi, {user.username}</span>
            <button onClick={logout} className="btn">Sign out</button>
          </>
        ) : (
          <button onClick={() => onRoute('login')} className="btn">Sign in</button>
        )}
      </div>
    </header>
  )
}

function Home() {
  return (
    <div className="container">
      <h1>Welcome to the Community Demo</h1>
      <p className="muted">A simple, consent-first demo community. Sign in to post and interact.</p>
    </div>
  )
}

function Feed() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    api.getPosts().then(setPosts).catch(() => setPosts([]))
  }, [])
  return (
    <div className="container">
      <h2>Feed</h2>
      <div className="posts">
        {posts.length === 0 && <div className="card muted">No posts yet — be the first!</div>}
        {posts.map(p => (
          <article key={p.id} className="card post">
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function Create() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  async function submit(e) {
    e.preventDefault()
    if (!user) return alert('Please sign in to create posts.')
    try {
      await api.createPost({ title, body })
      alert('Post created (demo). Refresh feed.')
      setTitle(''); setBody('')
    } catch (err) {
      alert('Failed to create post (demo).')
    }
  }
  return (
    <div className="container">
      <h2>Create Post</h2>
      <form className="card create-form" onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Write something..." value={body} onChange={e => setBody(e.target.value)} rows={5} required />
        <div style={{display:'flex', gap:8}}>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

function Login({ onRoute }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  async function submit(e) {
    e.preventDefault()
    try {
      await login(username, password)
      onRoute('feed')
    } catch (err) {
      alert('Login failed (demo). Use any username/password to simulate.')
    }
  }
  return (
    <div className="container">
      <h2>Sign in</h2>
      <form className="card" onSubmit={submit}>
        <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn">Sign in</button>
      </form>
    </div>
  )
}

function AppInner() {
  const [route, setRoute] = useState('home')
  const [routeParam, setRouteParam] = useState(null)
  function navigate(r, p) { setRoute(r); setRouteParam(p || null) }
  return (
    <>
      <Nav onRoute={navigate} />
      <main>
        {route === 'home' && <Home />}
        {route === 'feed' && <Feed />}
        {route === 'create' && <Create />}
        {route === 'login' && <Login onRoute={navigate} />}
      </main>
      <footer className="footer">Community demo • Built with Vite + React</footer>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
