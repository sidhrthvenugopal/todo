const User=require("../models/blogUser")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET


const registeruser=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        const emailExists=await User.findOne({email})
        if(emailExists){
            return res.statrus(409).send("Email already exists!")
        }
        const salt=await bcrypt.genSalt()
        const hashedPassword=await bcrypt.hash(password,salt)
        const user=new User({name,email,password:hashedPassword})
        await user.save()
        res.status(200).send("User has been registered")
    } catch (error) {
        res.status(500).send("error occured while registering user")
    }
}
const loginUser= async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).send("User not found")
        }
         const isPwdMatch=await bcrypt.compare(password,user.password)
        if(!isPwdMatch){
            return res.status(401).send("Invalid password")
            console.log("Invalid password")
        }
         const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET,
            { expiresIn: "10m" }
        )

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name },
        })
        // res.status(200).json({success: true,message: "Login successful",authority: user})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Unable to log in")
    }
}
module.exports={registeruser,loginUser}