const router=require("express").Router()
const homeController=require("../controllers/homecontrollers")
const authMidware =require("../middleware/blogMidware")

router.get("/blog",homeController.getBlogs)
router.get("/myblogs",authMidware,homeController.getMyBlogs)
router.post("/addblog",authMidware,homeController.addBlog)
router.put("/update/:blogId",authMidware,homeController.updateBlog)
router.delete("/delete/:blogId",authMidware,homeController.deleteBlog)
router.get("/view/:id",authMidware,homeController.viewBlog)

module.exports=router