const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post("/", async (req, res)=>{
    try{
        const newPost =new Post(req.body);
        const post= await newPost.save();
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
})

// update a post
router.put("/:id", async (req, res)=>{
    if(req.params.id.userId === req.body.userId){
        try{
            await Post.findByIdAndUpdate(req.params.id,{
                $set: req.body
            })
            res.status(200).json("Post has been updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your posts!");
    }
})

// delete a post
router.delete("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("Post has been deleted successfully");
        }
    else{
        return res.status(403).json("You can delete only your post!");
    }}
    catch(err){
        return res.status(500).json(err);
    }
});

// like a post
router.put("/:id/like", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
            if(!post.likes.includes(req.body.userId)){
                await post.updateOne({$push: {likes: req.body.userId}});
                res.status(200).json("You have liked this post");
            }else{
                await post.updateOne({$pull: {likes: req.body.userId}});
                res.status(200).json("You have unliked this post");
            }
    }
    catch(err){
        res.status(500).json(err);
    }
});

// get a post
router.get("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        return res.status(500).json(err);
    }
});

// get timeline posts
router.get("/timeline/all", async (req, res)=>{
    try{
        const currentUser= await User.findById(req.body.userId);
        const userPosts= await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId)=> {
              return Post.find({userId: friendId});
            })
        );
         res.json(userPosts.concat(...friendPosts));
    }catch(err){
         res.status(500).json(err);
    }
});

module.exports = router;