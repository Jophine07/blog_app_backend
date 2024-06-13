const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {blogmodel} = require("./models/blog")
const jwt=require("jsonwebtoken")
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

app.post("/signIn",(req,res)=>{
let input=req.body
blogmodel.find({"email":req.body.email}).then(
    (response)=>{
            if(response.length>0)
                {
                    let dbpassword=response[0].password
                    console.log(dbpassword)
                    bcrypt.compare(input.password,dbpassword,(error,isMatch)=>{

                        if(isMatch)
                            {
                               jwt.sign({email:input.email},"blog_app",{expiresIn:"1d"},(error,token)=>{
                                if(error){
                                    res.json({"status":"unable to create token"})
                                }
                                else
                                {
                                    res.json({"status":"success","userid":response[0]._id,"token":token})
                                }
                               })
                            }
                        else{
                            res.json({"status":"incorrect"})
                        }
                    })

                }
                else{
                    res.json({"status":"User Not Found"})
                }
    }
).catch()
})

app.listen(8080,()=>{
console.log("started")
})