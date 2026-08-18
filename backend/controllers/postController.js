const pool=require("../config/db");
async function getFeed(req,res){try{
 const[u]=await pool.execute(`SELECT p.id,p.content,p.image,p.created_at,u.id user_id,u.name,u.avatar,
 (SELECT COUNT(*) FROM post_likes x WHERE x.post_id=p.id) like_count,
 (SELECT COUNT(*) FROM comments x WHERE x.post_id=p.id) comment_count,
 EXISTS(SELECT 1 FROM post_likes x WHERE x.post_id=p.id AND x.user_id=?) liked
 FROM posts p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC`,[req.user.id]);
 for(const p of u){const[c]=await pool.execute(`SELECT c.id,c.content,c.created_at,u.id user_id,u.name,u.avatar
 FROM comments c JOIN users u ON u.id=c.user_id WHERE c.post_id=? ORDER BY c.created_at`,[p.id]);p.comments=c}
 res.json({success:true,posts:u});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not load feed"})}}
async function createPost(req,res){try{
 const{content,image=""}=req.body;if(!content||!content.trim())return res.status(400).json({success:false,message:"Post content is required"});
 await pool.execute("INSERT INTO posts(user_id,content,image) VALUES(?,?,?)",[req.user.id,content.trim(),image.trim()]);
 res.status(201).json({success:true,message:"Post created"});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not create post"})}}
async function toggleLike(req,res){try{
 const[e]=await pool.execute("SELECT id FROM post_likes WHERE post_id=? AND user_id=?",[req.params.id,req.user.id]);
 if(e.length){await pool.execute("DELETE FROM post_likes WHERE id=?",[e[0].id]);return res.json({success:true,liked:false})}
 await pool.execute("INSERT INTO post_likes(post_id,user_id) VALUES(?,?)",[req.params.id,req.user.id]);
 res.json({success:true,liked:true});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not update like"})}}
async function addComment(req,res){try{
 const{content}=req.body;if(!content||!content.trim())return res.status(400).json({success:false,message:"Comment cannot be empty"});
 await pool.execute("INSERT INTO comments(post_id,user_id,content) VALUES(?,?,?)",[req.params.id,req.user.id,content.trim()]);
 res.status(201).json({success:true,message:"Comment added"});
}catch(e){console.error(e);res.status(500).json({success:false,message:"Could not add comment"})}}
module.exports={getFeed,createPost,toggleLike,addComment};