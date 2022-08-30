const Users = require("../models/usermodel")

const userControl = {
    searchUser : async (request, response) => {
        try{
            const users = await Users.find({user_name: {$regex: request.query.user_name}})
            .limit(10).select("full_name user_name avatar")

            response.json({users})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getUser: async (request, response) => {
        try {
           const user = await Users.findById(request.params.id).select('-password')
           .populate("followers following", "-password")
           if(!user) return response.status(400).json({msg: "User does not exist."})

           response.json({user})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    updateUser: async (request, response) => {
        try {
            const { avatar, full_name, user_name, email_id, mobile_no, address, website, story, gender } = request.body
            if(!full_name) return response.status(400).json({msg: "Please add your Full Name."})
            
            await Users.findOneAndUpdate({_id:request.user._id}, {
                avatar, full_name, user_name, email_id, mobile_no, address, website, story, gender
            })

            response.json({msg: "Update Success!"})
         } catch (err) {
             return response.status(500).json({msg: err.message})
         }
    },
    follow: async (request, response) => {
        try {
            const user = await Users.find({_id: request.params.id, followers: request.user._id})
            if(user.length > 0) return response.status(500).json({msg: "You followed this user."})

            const newUser = await Users.findOneAndUpdate({_id: request.params.id}, {
                $push: {followers: request.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: request.user._id}, {
                $push: {following: request.params.id}
            }, {new: true})

            response.json({newUser})
         } catch (err) {
             return response.status(500).json({msg: err.message})
         }
    },
    unfollow: async (request, response) => {
        try {
            
            const newUser = await Users.findOneAndUpdate({_id: request.params.id}, {
                $pull: {followers: request.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: request.user._id}, {
                $pull: {following: request.params.id}
            }, {new: true})

            response.json({newUser})
         } catch (err) {
             return response.status(500).json({msg: err.message})
         }
    },
    suggestionsUser: async (request, response) => {
        try {
            const newArr = [...request.user.following, request.user._id]

            const num  = request.query.num || 10

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return response.json({
                users,
                result: users.length
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
}

module.exports = userControl