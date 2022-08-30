const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    full_name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 25
    },
    user_name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 25,
        unique : true 
    },
    email_id : {
        type : String,
        required : true,
        trim : true,
        unique : true 
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
        default : "https://www.kindpng.com/picc/m/78-785975_icon-profile-bio-avatar-person-symbol-chat-icon.png"
    },
    role : {
        type : String,
        default : "user"
    },
    gender : {
        type : String,
        default : "male"
    },
    mobile_no : {
        type : String,
        default : ""
    },
    address : {
        type : String,
        default : ""
    },
    story : {
        type : String,
        default : "",
        maxlength : 200
    },
    website : {
        type : String,
        default : ""
    },
    followers : [
        {
            type : mongoose.Types.ObjectId,
            ref : "user"
        }
    ],
    following : [
        {
            type : mongoose.Types.ObjectId,
            ref : "user"
        }
    ],
    saved: [
        {
            type: mongoose.Types.ObjectId, 
            ref: 'user'
        }
    ]
},{
    timestamps: true
})

module.exports = mongoose.model("user",userSchema)