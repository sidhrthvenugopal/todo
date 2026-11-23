import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notice, setNotice] = useState('')
  const [blogs, setBlogs] = useState([])
  const nav = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))

  const fetchBlogs = useCallback(() => {
    return axios.get('https://todo-alpha.vercel.app/api/home/blog')
      .then((response) => setBlogs(response.data))
      .catch(() => setNotice('Unable to load blogs. Please try again.'))
  }, [])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')

    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoggedIn(true)
      setShowForm(false)
      nav('/')
      return
    }

    try {
      await axios.post(
        'https://todo-alpha.vercel.app/api/home/addblog',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setTitle('')
      setContent('')
      nav('/')
      setShowForm(false)
      setIsLoggedIn(true)
      await fetchBlogs()
    } 
    
    catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setIsLoggedIn(false)
        setShowForm(false)
        setNotice('Please log in again to publish a blog.')
        return
      }

      const responseData = requestError.response?.data
      setNotice(
        responseData?.message
          || (typeof responseData === 'string' ? responseData : '')
          || 'Unable to add your blog. Please try again.',
      )
    }
  }

  function handleLog() {
    nav('/login')
  }

  function handleReg() {
    nav('/register')
  }

  function handleAddBlog() {
    if (!localStorage.getItem('token')) {
      nav('/login')
      return
    }
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
  }

  function handleLogout() {
    localStorage.clear()
    window.location.reload()
    setIsLoggedIn(false)
    setShowForm(false)
    setNotice('You have been logged out.')
  }

  function handleMyBlogs(){
    nav('/myblogs')
  }

  return (
    <main className="blog-page">
      <header className="blog-header">
        <a className="blog-brand" href="/">dayflow<span>.</span></a>
        <div className="blog-header-actions">
          {isLoggedIn ? (<>
            <button className="blog-add-button" onClick={handleLogout}>Logout</button>
            <button className='blog-add-button' onClick={handleMyBlogs}>MY BLOGS</button>
            <button className="blog-add-button" type="button" onClick={handleAddBlog}>

            <span aria-hidden="true">+</span> Add blog
          </button>
          </>
          ) : (
            <>
              <button className="blog-add-button" onClick={handleLog}>login</button>
              <button className="blog-add-button" onClick={handleReg}>Register</button>
              
            </>
          )}
          
          
          
        </div>
      </header>

      <section className="blog-welcome" aria-labelledby="blog-page-title">
        <span className="eyebrow">YOUR WRITING SPACE</span>
        <h1 id="blog-page-title">Ideas worth sharing.</h1>
        <p>Start with a thought and turn it into a story.</p>
        {notice && <p className="blog-notice" role="status">{notice}</p>}
      </section>
      <section className="blog-showcase">
        <h2>Latest blogs</h2>

        {blogs.length === 0 && <p>No blogs yet.</p>}

        <div className="blog-grid">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog._id}>
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              {blog.createdAt && (
                <small className="blog-card-date">
                  Added <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleString()}</time>
                </small>
              )}
              <small><span style={{ color: '#515151', fontStyle: 'italic', fontWeight: 600 }}>Author : </span>{blog.author}</small>
            </article>
          ))}
        </div>
      </section>

      {showForm && (
        <div className="blog-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeForm()
        }}>
          <section className="blog-modal" role="dialog" aria-modal="true" aria-labelledby="blog-modal-title">
            <button className="blog-modal-close" type="button" onClick={closeForm} aria-label="Close form">
              &times;
            </button>
            <span className="eyebrow">NEW STORY</span>
            <h2 id="blog-modal-title">Add a blog</h2>
            <p className="blog-modal-intro">Capture your idea and share it with the world.</p>

            <form className="blog-form" onSubmit={handleSubmit}>
              <label htmlFor="blog-title">Title</label>
              <input
                id="blog-title"
                type="text"
                placeholder="Give your story a title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={160}
                required
              />
              <label htmlFor="blog-content">Content</label>
              <textarea
                id="blog-content"
                placeholder="What would you like to write about?"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={6}
                required
              />
              
              <button className="blog-submit-button" type="submit">
                Publish blog <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default Home
