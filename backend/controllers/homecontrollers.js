const Blog = require("../models/blog")
const User = require("../models/blogUser")
const mongoose = require("mongoose")

const withAuthorNames = async (blogs) => {
    const authorIds = [...new Set(
        blogs
            .map((blog) => blog.author)
            .filter((author) => mongoose.Types.ObjectId.isValid(author)),
    )]
    const users = await User.find({ _id: { $in: authorIds } }).select("name")
    const namesById = new Map(users.map((user) => [user._id.toString(), user.name]))

    return blogs.map((blog) => {
        const result = blog.toObject()
        result.author = namesById.get(blog.author) || blog.author
        return result
    })
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
        res.json(await withAuthorNames(blogs))
    } catch (error) {
        console.error("Unable to load blogs:", error)
        res.status(500).json({ message: "Unable to load blogs" })
    }
}

const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.userId }).sort({ createdAt: -1 })
        res.json(await withAuthorNames(blogs))
    } catch (error) {
        console.error("Unable to load your blogs:", error)
        res.status(500).json({ message: "Unable to load your blogs" })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params
        const blog = await Blog.findOneAndDelete({ _id: blogId, author: req.userId })
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }
        res.status(200).json({ message: "Blog deleted" })
    } catch (error) {
        console.error("Unable to delete blog:", error)
        res.status(500).json({ message: "Unable to delete blog" })
    }
}

const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params
        const { title, content } = req.body
        const blog = await Blog.findOneAndUpdate(
            { _id: blogId, author: req.userId },
            { title, content },
            { new: true, runValidators: true },
        )
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }
        res.json({ message: "Blog has been updated", blog })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }
        console.error("Unable to update blog:", error)
        res.status(500).json({ message: "Unable to update blog" })
    }
}

const viewBlog = async (req, res) => {
    try {
        const { id } = req.params
        const blog = await Blog.findOne({ _id: id, author: req.userId })
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }
        res.json((await withAuthorNames([blog]))[0])
    } catch (error) {
        console.error("Unable to load blog:", error)
        res.status(500).json({ message: "Unable to load blog" })
    }
}


const addBlog = async (req, res) => {
    try {
        const { title, content } = req.body

        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(401).json({ message: "User not found. Please log in again." })
        }

        const blog = new Blog({
            title: title.trim(),
            content: content.trim(),
            author: user._id.toString(),
        })

        await blog.save()
        res.status(201).json({ message: "Blog added", blog: (await withAuthorNames([blog]))[0] })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }
        console.error("Unable to add blog:", error)
        res.status(500).json({ message: "Unable to add blog" })
    }
}

module.exports = { getBlogs, getMyBlogs, addBlog, deleteBlog, updateBlog, viewBlog }