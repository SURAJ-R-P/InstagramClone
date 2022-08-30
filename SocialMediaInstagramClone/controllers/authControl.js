const Users = require("../models/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const authControl = {
    register : async (request, response) =>{
        try {
            const { full_name, user_name, email_id, password, gender} = request.body
            // console.log(request.body)
            let newUserName = user_name.toLowerCase().replace(/ /g, '')
            // console.log(newUserName)
            
            const UserName = await Users.findOne({user_name: newUserName})
            if(UserName) return response.status(400).json({msg : "User name already exists."})

            const EmailId = await Users.findOne({email_id})
            if(EmailId) return response.status(400).json({msg : "EmailId already exists."})
            
            if(password.length < 8 ) return response.status(400).json({msg : "Password must be at least 8 characters."})

            const passwordHash = await bcrypt.hash(password,15)

            const newUser = new Users({
                full_name, user_name:newUserName, email_id, password:passwordHash, gender
            })

            // console.log(newUser)
            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})
            
            // console.log({access_token,refresh_token})

            response.cookie("refreshtoken", refresh_token, {
                httpOnly : true,
                path : "/api/refresh_token",
                maxAge : 30*24*60*60*1000 // for 30 days
            })

            await newUser.save()

            response.json({
                msg : "Register Success!",
                access_token,
                user : {
                    ...newUser._doc,
                    password : "" 
                }
            })
        } catch (err) {
            return response.status(500).json({msg : err.message})
        }
    },
    login : async (request, response) =>{
        try {
            const { email_id, password } = request.body

            const user = await Users.findOne({email_id}).populate("followers following", "avatar user_name full_name followers following")

            if(!user) return response.status(400).json({msg : "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return response.status(400).json({msg : "Password is incorrect."})

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user ._id})
            
            // console.log({access_token,refresh_token})

            response.cookie("refreshtoken", refresh_token, {
                httpOnly : true,
                path : "/api/refresh_token",
                maxAge : 30*24*60*60*1000 // for 30 days
            })

            response.json({
                msg : "Login Success!",
                access_token,
                user : {
                    ...user._doc,
                    password : "" 
                }
            })
        } catch (err) {
            return response.status(500).json({msg : err.message})
        }
    },
    logout : async (request, response) =>{
        try {
            response.clearCookie("refreshtoken", {path : "/api/refresh_token"})
            return response.json({msg : "Logged out!"})
        } catch (err) {
            return response.status(500).json({msg : err.message})
        }
    },
    generateAccessToken : async (request, response) =>{
        try {
            const rf_token = request.cookies.refreshtoken
            if(!rf_token) return response.status(400).json({msg : "Please Login."})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_S, async (err,result) =>{
                if(err) return response.status(400).json({msg : "Please Login."})

                // console.log(result)
                const user = await Users.findById(result.id).select("-password").populate("followers following", "avatar user_name full_name followers following")

                if(!user) return response.status(400).json({msg : "This  does not exist."})

                const access_token = createAccessToken({ id: result.id })

                response.json({
                    access_token,
                    user
                })
            })
        } catch (err) {
            return response.status(500).json({msg : err.message})
        }
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_S, {expiresIn: "1d"})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_S, {expiresIn: "30d"})
}
module.exports = authControl