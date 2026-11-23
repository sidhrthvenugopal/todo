const jwt=require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET


const authMidware = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).send("Unauthorized access!")
        }
        token = token.split(" ")[1]
        const decoded=jwt.verify(token,JWT_SECRET)
        
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).send("Invalid or expired token!")
    }
}
module.exports=authMidware