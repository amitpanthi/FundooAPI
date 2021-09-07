const Note = require("../models/Notes")
const logger = require("../logger/logger")
const DEFAULT_LOG_STRING = `${new Date().toLocaleString()}: `

let notesControl = {
    async postANote(request, response){
        const aNote = new Note({
            title: request.body.title,
            description: request.body.description
        })

        if(request.body.isPinned != null){
            aNote.isPinned = request.body.isPinned
        }

        if(request.body.isArchived != null){
            aNote.isArchived = request.body.isArchived
        }

        if(request.body.color != null){
            aNote.color = request.body.color
        }

        try{
            const newNote = await aNote.save()
            logger.info(DEFAULT_LOG_STRING + `Successfully inserted a note: ${aNote}`)
            response.status(201).json(newNote)
        } catch (err) {
            logger.error(DEFAULT_LOG_STRING + `Status 400: ${err.message}.`)
            response.status(400).json({ message: err.message })
        }
    },

    async getNotesList(request, response){
        try{
            const allNotes = await Note.find()
            logger.info(DEFAULT_LOG_STRING + `Successfully queried all notes: ${allNotes}`)
            response.status(200).json(allNotes)
        } catch(err) {
            logger.error(DEFAULT_LOG_STRING + `Status 400: ${err.message}.`)
            response.status(400).json({ message: err.message })
        }
    }
}

module.exports = notesControl