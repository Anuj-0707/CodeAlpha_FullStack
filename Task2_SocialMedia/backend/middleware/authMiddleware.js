const jwt=require("jsonwebtoken");
module.exports=(req,res,next)=>{
 const h=req.headers.authorization;
 if(!h||!h.startsWith("Bearer "))return res.status(401).json({success:false,message:"Login required"});
 try{req.user=jwt.verify(h.split(" ")[1],process.env.JWT_SECRET);next()}
 catch(e){res.status(401).json({success:false,message:"Invalid or expired token"})}
};