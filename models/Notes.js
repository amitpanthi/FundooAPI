const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    "title": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        required: true
    },
    "isPinned": {
        type: Boolean,
        default: false
    },
    "isArchived": {
        type: Boolean,
        default: false
    },
    "isDeleted": {
        type: Boolean,
        default: false
    },
    "color": {
        type: String
    }
})

module.exports = mongoose.model('Note', noteSchema)