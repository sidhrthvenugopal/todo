import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleRegister(event) {
    event.preventDefault()
    try {
      const res = await axios.post("http://localhost:5550/api/authority/register", {
        name: username,
        email,
        password
      })
      setUsername("")
      setEmail("")
      setPassword("")
      console.log(res.data)
      alert("Registered successfully")
      navigate("/login")
    } catch (error) {
      alert(error.response?.data || "Unable to register. Please try again.")
    }
  }

  return (
    <main className="auth-page auth-page--register">
      <section className="auth-layout">
        <aside className="auth-panel">
          <Link className="auth-brand" to="/">dayflow<span>.</span></Link>
          <div className="auth-panel-copy">
            <span className="eyebrow">MAKE ROOM FOR WHAT MATTERS</span>
            <h1>Your next chapter starts here.</h1>
            <p>Bring your plans, ideas, and everyday wins together in one calm place.</p>
          </div>
          <div className="signup-note">
            <span className="signup-note-mark">✳</span>
            <div><strong>Start fresh, stay focused.</strong><p>Your goals deserve a space of their own.</p></div>
          </div>
          <div className="auth-panel-foot">A little progress adds up.</div>
        </aside>

        <section className="auth-card" aria-labelledby="register-title">
          <div className="mobile-brand"><Link className="auth-brand" to="/">dayflow<span>.</span></Link></div>
          <div className="auth-heading">
            <span className="eyebrow">GET STARTED — IT&apos;S FREE</span>
            <h2 id="register-title">Create your account</h2>
            <p>Let&apos;s make a little progress together.</p>
          </div>
          <form className="auth-form" onSubmit={handleRegister}>
            <label htmlFor="register-name">Your name</label>
            <input id="register-name" type="text" placeholder="e.g. Alex Morgan" autoComplete="name" value={username} onChange={(event) => setUsername(event.target.value)} required />
            <label htmlFor="register-email">Email address</label>
            <input id="register-email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="register-password">Password</label>
            <input id="register-password" type="password" placeholder="Create a password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="auth-submit" type="submit">Create account <span aria-hidden="true">→</span></button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </section>
      </section>
    </main>
  )
}

export default Register
