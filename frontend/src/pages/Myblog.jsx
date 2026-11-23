import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


function Myblog() {
  const [blogs, setBlogs] = useState([])
  const [editingBlog, setEditingBlog] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notice, setNotice] = useState('')
  const navigate = useNavigate()

 const fetchBlogs=(()=>{
  const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return 
    }

    return axios.get("https://todo-alpha.vercel.app/api/home/myblogs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBlogs(response.data))
      .catch((error) => {
       (error, 'Unable to load your blogs. Please try again.')
 })
    }
  )
 

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  function startEditing(blog) {
    setEditingBlog(blog)
    setTitle(blog.title)
    setContent(blog.content)
    setNotice('')
  }

  function closeForm() {
    setEditingBlog(null)
    setTitle('')
    setContent('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    const token = localStorage.getItem('token')

    try {
      await axios.put(`https://todo-alpha.vercel.app/api/home/update/${editingBlog._id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } },
    )
      closeForm()
      await fetchBlogs()
    } catch (error) {
      handleError(error, 'Unable to update your blog.')
    }
  }

  async function handleDelete(blogId) {
        const token = localStorage.getItem('token')

      try {
        const res=await axios.delete(`https://todo-alpha.vercel.app/api/home/delete/${blogId}`,{
           headers: { Authorization: `Bearer ${token}` },
        })
        alert("are you sure to delete")
        setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog._id !== blogId))
        setNotice('Blog deleted.')
      } catch (error) {
        console.log(error,'Unable to delete your blog. Please try again.')
      }
  }
    

  return (
    <main className="blog-page">
      <header className="blog-header">
        <a className="blog-brand" href="/">dayflow<span>.</span></a>
        <div className="blog-header-actions">
          <button className="blog-add-button" type="button" onClick={() => navigate('/')}>
            All blogs
          </button>
        </div>
      </header>

      <section className="blog-welcome" aria-labelledby="my-blogs-title">
        <span className="eyebrow">YOUR WRITING SPACE</span>
        <h1 id="my-blogs-title">My blogs</h1>
        <p>Only you can view and manage the blogs you have written.</p>
        {notice && <p className="blog-notice" role="status">{notice}</p>}
      </section>

      <section className="blog-showcase">
        <h2>Your stories</h2>
        {/* {blogs.length === 0 && <p>You haven&apos;t published any blogs yet.</p>} */}
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog._id}>
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <small>{blog.author}</small>
              <div className="blog-header-actions">
                <button className="blog-add-button" type="button" onClick={() => startEditing(blog)}>
                  Edit
                </button>
                <button className="blog-add-button" type="button" onClick={() => handleDelete(blog._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {editingBlog && (
        <div className="blog-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeForm()
        }}>
          <section className="blog-modal" role="dialog" aria-modal="true" aria-labelledby="edit-blog-title">
            <button className="blog-modal-close" type="button" onClick={closeForm} aria-label="Close form">
              &times;
            </button>
            <span className="eyebrow">YOUR STORY</span>
            <h2 id="edit-blog-title">Edit your blog</h2>
            <form className="blog-form" onSubmit={handleSubmit}>
              <label htmlFor="blog-title">Title</label>
              <input
                id="blog-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={160}
                required
              />
              <label htmlFor="blog-content">Content</label>
              <textarea
                id="blog-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={6}
                required
              />
              <button className="blog-submit-button" type="submit">
                Save changes <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default Myblog
