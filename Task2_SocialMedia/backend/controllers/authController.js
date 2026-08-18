const bcrypt=require("bcryptjs"),jwt=require("jsonwebtoken"),pool=require("../config/db");
async function register(req,res){try{
 const{name,email,password}=req.body;
 if(!name||!email||!password)return res.status(400).json({success:false,message:"All fields are required"});
 if(password.length<6)return res.status(400).json({success:false,message:"Password must be at least 6 characters"});
 const[e]=await pool.execute("SELECT id FROM users WHERE email=?",[email]);
 if(e.length)return res.status(409).json({success:false,message:"Email already registered"});
 await pool.execute("INSERT INTO users(name,email,password) VALUES(?,?,?)",[name,email,await bcrypt.hash(password,10)]);
 res.status(201).json({success:true,message:"Registration successful"});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Registration failed"})}}
async function login(req,res){try{
 const{email,password}=req.body,[u]=await pool.execute("SELECT id,name,email,password,bio,avatar FROM users WHERE email=?",[email]);
 if(!u.length)return res.status(401).json({success:false,message:"Invalid email or password"});
 const user=u[0];if(!await bcrypt.compare(password,user.password))return res.status(401).json({success:false,message:"Invalid email or password"});
 delete user.password;const token=jwt.sign({id:user.id,name:user.name,email:user.email},process.env.JWT_SECRET,{expiresIn:"2h"});
 res.json({success:true,message:"Login successful",token,user});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Login failed"})}}
module.exports={register,login};