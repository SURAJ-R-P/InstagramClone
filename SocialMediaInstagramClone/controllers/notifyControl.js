const Notifies = require('../models/notifyModel')

const notifyControl = {
    createNotify: async (request, response) => {
        try {
            const { id, recipients, url, text, content, image } = request.body

            if(recipients.includes(request.user._id.toString())) return;

            const notify = new Notifies({
                id, recipients, url, text, content, image, user: request.user._id
            }) 
  
            await notify.save()
            return response.json({notify})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    removeNotify: async (request, response) => {
        try {
            const notify = await Notifies.findOneAndDelete({
                id: request.params.id, url: request.query.url
            })
            
            return response.json({notify})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    getNotifies: async (request, response) => {
        try {
            const notifies = await Notifies.find({recipients: request.user._id})
            .sort('-createdAt').populate('user', 'avatar user_name')
            
            return response.json({notifies})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    isReadNotify: async (request, response) => {
        try {
            const notifies = await Notifies.findOneAndUpdate({_id: request.params.id}, {
                isRead: true
            })

            return response.json({notifies})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
    deleteAllNotifies: async (request, response) => {
        try {
            const notifies = await Notifies.deleteMany({recipients: request.user._id})
            
            return response.json({notifies})
        } catch (err) {
            return response.status(500).json({msg: err.message})
        }
    },
}


module.exports = notifyControl