const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({ 
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    questionId: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('Answer', answerSchema)