import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    try {
    const res = await axios.post("https://todo-alpha.vercel.app/api/authority/login", {
        email,
        password
    });

    if (res.data.success) {
        localStorage.setItem("token", res.data.token)
       
        setEmail("")
        setPassword("")
        alert("Login successful")
        navigate("/")
    } 
    else {
        alert(res.data.message || "Invalid email or password")
    }

} catch (error) {
    const responseData = error.response?.data
    alert(
      responseData?.message
        || (typeof responseData === "string" ? responseData : "")
        || "Unable to log in. Please try again.",
    )
}
}
  return (
    <main className="auth-page auth-page--login">
      <section className="auth-layout">
        <aside className="auth-panel">
          <Link className="auth-brand" to="/">dayflow<span>.</span></Link>
          <div className="auth-panel-copy">
            <span className="eyebrow">YOUR SPACE TO GROW</span>
            <h1>Small steps.<br />Big momentum.</h1>
            <p>Keep your goals close and make today count, one task at a time.</p>
          </div>
          <div className="task-preview" aria-hidden="true">
            <div className="task-preview-top"><span>Today&apos;s focus</span><span className="preview-dots">•••</span></div>
            <div className="preview-task"><span className="preview-check">✓</span><span>Plan the week</span><span className="preview-tag">DONE</span></div>
            <div className="preview-task"><span className="preview-check preview-check--empty"></span><span>Make time for you</span><span className="preview-spark">✦</span></div>
            <div className="preview-progress"><span /></div>
            <div className="preview-caption">You&apos;re building a good rhythm.</div>
          </div>
          <div className="auth-panel-foot">A little progress adds up.</div>
        </aside>

        <section className="auth-card" aria-labelledby="login-title">
          <div className="mobile-brand"><Link className="auth-brand" to="/">dayflow<span>.</span></Link></div>
          <div className="auth-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2 id="login-title">Good to see you</h2>
            <p>Pick up right where you left off.</p>
          </div>
          <form className="auth-form" onSubmit={handleLogin}>
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <div className="field-heading">
              <label htmlFor="login-password">Password</label>
            </div>
            <input id="login-password" type="password" placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="auth-submit" type="submit">Sign in <span aria-hidden="true">→</span></button>
          </form>
          <p className="auth-switch"> <Link to="/register">Create an account</Link></p>
        </section>
      </section>
    </main>
  )
}

export default Login