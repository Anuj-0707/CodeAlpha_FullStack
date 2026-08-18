const pool=require("../config/db");
async function getUsers(req,res){try{
 const[u]=await pool.execute(`SELECT u.id,u.name,u.email,u.bio,u.avatar,
 (SELECT COUNT(*) FROM followers f WHERE f.following_id=u.id) followers_count,
 (SELECT COUNT(*) FROM followers f WHERE f.follower_id=u.id) following_count,
 EXISTS(SELECT 1 FROM followers f WHERE f.follower_id=? AND f.following_id=u.id) following
 FROM users u WHERE u.id<>? ORDER BY u.name`,[req.user.id,req.user.id]);
 res.json({success:true,users:u});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not load users"})}}
async function getProfile(req,res){try{
 const id=req.params.id,[u]=await pool.execute(`SELECT u.id,u.name,u.email,u.bio,u.avatar,u.created_at,
 (SELECT COUNT(*) FROM followers f WHERE f.following_id=u.id) followers_count,
 (SELECT COUNT(*) FROM followers f WHERE f.follower_id=u.id) following_count,
 EXISTS(SELECT 1 FROM followers f WHERE f.follower_id=? AND f.following_id=u.id) following
 FROM users u WHERE u.id=?`,[req.user.id,id]);
 if(!u.length)return res.status(404).json({success:false,message:"User not found"});
 const[p]=await pool.execute(`SELECT p.id,p.content,p.image,p.created_at,
 (SELECT COUNT(*) FROM post_likes x WHERE x.post_id=p.id) like_count,
 (SELECT COUNT(*) FROM comments x WHERE x.post_id=p.id) comment_count
 FROM posts p WHERE p.user_id=? ORDER BY p.created_at DESC`,[id]);
 res.json({success:true,user:u[0],posts:p});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not load profile"})}}
async function toggleFollow(req,res){try{
 const id=Number(req.params.id);if(id===req.user.id)return res.status(400).json({success:false,message:"You cannot follow yourself"});
 const[t]=await pool.execute("SELECT id FROM users WHERE id=?",[id]);if(!t.length)return res.status(404).json({success:false,message:"User not found"});
 const[e]=await pool.execute("SELECT id FROM followers WHERE follower_id=? AND following_id=?",[req.user.id,id]);
 if(e.length){await pool.execute("DELETE FROM followers WHERE id=?",[e[0].id]);return res.json({success:true,following:false})}
 await pool.execute("INSERT INTO followers(follower_id,following_id) VALUES(?,?)",[req.user.id,id]);
 res.json({success:true,following:true});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not update follow"})}}
async function updateProfile(req,res){try{
 const{name,bio="",avatar=""}=req.body;if(!name||!name.trim())return res.status(400).json({success:false,message:"Name is required"});
 await pool.execute("UPDATE users SET name=?,bio=?,avatar=? WHERE id=?",[name.trim(),bio.trim(),avatar.trim(),req.user.id]);
 res.json({success:true,message:"Profile updated"});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not update profile"})}}
module.exports={getUsers,getProfile,toggleFollow,updateProfile};