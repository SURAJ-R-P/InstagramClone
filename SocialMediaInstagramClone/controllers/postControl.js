const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/usermodel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postControl = {
    createPost: async (request, response) => {
        try {
            const { content, images } = request.body

            if(images.length === 0)
            return response.status(400).json({msg: "Please add your photo."})

            const newPost = new Posts({
                content, images, user: request.user._id
            })
            await newPost.save()

            response.json({
                msg: 'Post Created!',
                newPost: {
                    ...newPost._doc,
                    user: request.user
                }
            })
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getPosts: async (request, response) => {
        try {
            const features = new APIfeatures(Posts.find({
                user: [...request.user.following, request.user._id]
            }), request.query).paginating()

            const posts =  await features.query.sort('-createdAt')
            .populate("user likes", "avatar user_name full_name followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            response.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    updatePost: async (request, response) => {
        try {
            const { content, images } = request.body

            const post = await Posts.findOneAndUpdate({_id: request.params.id}, {
                content, images
            }).populate("user likes", "avatar user_name full_name")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            response.json({
                msg: "Post Updated!",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    likePost: async (request, response) => {
        try {
            const post = await Posts.find({_id: request.params.id, likes: request.user._id})
            if(post.length > 0) return response.status(400).json({msg: "You liked this post."})

            const like = await Posts.findOneAndUpdate({_id: request.params.id}, {
                $push: {likes: request.user._id}
            }, {new: true})

            if(!like) return response.status(400).json({msg: 'This post does not exist.'})

            response.json({msg: 'Post Liked!'})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    unLikePost: async (request, response) => {
        try {
            
            const like = await Posts.findOneAndUpdate({_id: request.params.id}, {
                $pull: {likes: request.user._id}
            }, {new: true})

            if(!like) return response.status(400).json({msg: 'This post does not exist.'})

            response.json({msg: 'Post UnLiked !'})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getUserPosts: async (request, response) => {
        try {
            const features = new APIfeatures(Posts.find({user: request.params.id}), request.query)
            .paginating()
            const posts = await features.query.sort("-createdAt")

            response.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getPost: async (request, response) => {
        try {
            const post = await Posts.findById(request.params.id)
            .populate("user likes", "avatar user_name full_name followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            if(!post) return response.status(400).json({msg: 'This post does not exist.'})

            response.json({post})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getPostsDicover: async (request, response) => {
        try {
            const newArr = [...request.user.following, request.user._id]

            const num  = request.query.num || 9

            const posts = await Posts.aggregate([
                { $match: { user : { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return response.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    deletePost: async (request, response) => {
        try {
            const post = await Posts.findOneAndDelete({_id: request.params.id, user: request.user._id})
            await Comments.deleteMany({_id: {$in: post.comments }})

            response.json({
                msg: 'Deleted Post!',
                newPost: {
                    ...post,
                    user: request.user
                }
            }) 

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    savePost: async (request, response) => {
        try {
            const user = await Users.find({_id: request.user._id, saved: request.params.id})
            if(user.length > 0) return response.status(400).json({msg: "You saved this post."})

            const save = await Users.findOneAndUpdate({_id: request.user._id}, {
                $push: {saved: request.params.id}
            }, {new: true})

            if(!save) return response.status(400).json({msg: 'This user does not exist.'})

            response.json({msg: 'Saved Post!'})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    unSavePost: async (request, response) => {
        try {
            const save = await Users.findOneAndUpdate({_id: request.user._id}, {
                $pull: {saved: request.params.id}
            }, {new: true})

            if(!save) return response.status(400).json({msg: 'This user does not exist.'})

            response.json({msg: 'unSaved Post!'})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getSavePosts: async (request, response) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: {$in: request.user.saved}
            }), request.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            response.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
}

module.exports = postControl