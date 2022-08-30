const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')

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

const messageControl = {
    createMessage: async (request, response) => {
        try {
            const { sender, recipient, text, media, call } = request.body

            if(!recipient || (!text.trim() && media.length === 0 && !call)) return;

            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    {recipients: [sender, recipient]},
                    {recipients: [recipient, sender]}
                ]
            }, {
                recipients: [sender, recipient],
                text, media, call
            }, { new: true, upsert: true })

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender, call,
                recipient, text, media
            })

            await newMessage.save()

            response.json({msg: 'Create Success!'})

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getConversations: async (request, response) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: request.user._id
            }), request.query).paginating()

            const conversations = await features.query.sort('-updatedAt')
            .populate('recipients', 'avatar user_name full_name')

            response.json({
                conversations,
                result: conversations.length
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getMessages: async (request, response) => {
        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    {sender: request.user._id, recipient: request.params.id},
                    {sender: request.params.id, recipient: request.user._id}
                ]
            }), request.query).paginating()

            const messages = await features.query.sort('-createdAt')

            response.json({
                messages,
                responseult: messages.length
            })

        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    deleteMessages: async (request, response) => {
        try {
            await Messages.findOneAndDelete({_id: request.params.id, sender: request.user._id})
            response.json({msg: 'Delete Success!'})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    deleteConversation: async (request, response) => {
        try {
            const newConver = await Conversations.findOneAndDelete({
                $or: [
                    {recipients: [request.user._id, request.params.id]},
                    {recipients: [request.params.id, request.user._id]}
                ]
            })
            await Messages.deleteMany({conversation: newConver._id})
            
            response.json({msg: 'Delete Success!'})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
}


module.exports = messageControl
