const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {blogmodel} = require("./models/blog")
const bcrypt=require("bcryptjs")


const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://jophine:jophinepaul@cluster0.oyyvgui.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")


const generateHashPassword =async(password)=>{   
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)

}

app.post("/signup",async (req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({"status":"success"})
})

app.listen(8080,()=>{
console.log("started")
})