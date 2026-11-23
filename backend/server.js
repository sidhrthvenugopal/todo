const express=require("express")
const cors=require("cors")
require("dotenv").config()
const DBConnect=require("./config/db")
const authRoutes=require("./routes/authRoutes")
const homeRoutes=require("./routes/homeRoutes")

const app= express()

const port= 5550

app.use(cors())
app.use(express.json())

DBConnect()

app.use("/api/authority",authRoutes)
app.use("/api/home",homeRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})