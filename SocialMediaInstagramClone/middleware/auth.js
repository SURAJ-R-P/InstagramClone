const Users = require("../models/usermodel")
const jwt = require("jsonwebtoken")

const auth = async (request, response, next) =>{
    try {
        const token = request.header("Authorization")

        if(!token) return response.status(400).json({msg: "Invalid Authorization."})

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_S)
        if(!decoded) return response.status(400).json({msg: "Invalid Authorization."})

        const user = await Users.findOne({_id: decoded.id})

        request.user = user
        next()
    }
    catch (err) {
        return response.status(500).json({msg: err.message})
    }
}

module.exports = auth