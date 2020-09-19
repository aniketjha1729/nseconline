const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys')
//

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        SENDGRID_API
    },
  })
);

router.post('/signup',(req,res)=>{
  const {name,email,password,pic,gender,role,department} = req.body 
  if(!email || !password || !name || !gender || !role || !department){
     return res.status(422).json({error:"please add all the fields"})
  }
  User.findOne({email:email})
  .then((savedUser)=>{ 
      if(savedUser){
        return res.status(422).json({error:"user already exists with that email"})
      }
      bcrypt.hash(password,12)
      .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic,
                gender,
                role,
                department
                
            })
    
            user.save()
            .then(succes => {
                const {_id}=succes
                transporter.sendMail({
                    to:user.email,
                    from:EMAIL,
                    subject:"Welcome",
                    html:"<h1>Welcome here</h1>"
                }) 
                User.findByIdAndUpdate(_id,{
                    $push: { following:_id }
                },{
                    new: true
                }).exec((err, result) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    } else {
                        res.json(result)
                    }
                })
                
            })
            .catch(err=>{
                console.log(err)
            })
      })
     
  })
  .catch(err=>{
    console.log(err)
  })
})


router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"Please add all the fields!"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Email not found!"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,followers,following,pic,gender} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic,gender}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password!"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


router.post('/reset-password',(req,res)=>{
     crypto.randomBytes(32,(err,buffer)=>{
         if(err){
             console.log(err)
         }
         const token = buffer.toString("hex")
         User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error:"User does not exists with this email"})
             }
             user.resetToken = token
             user.expireToken = Date.now() + 3600000
             user.save().then((result)=>{
                 transporter.sendMail({
                   to: user.email,
                   from: "noreply@nsec.com",
                   subject: "Password Reset",
                   html: `<p>Click The Link To reser the password</p><a href="http://localhost:3000/reset/${token}">Link</a>`
                     
                 }).then(res.json({message:"A verivation link has been send to your email."}))
             })

         })
     })
})


router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router