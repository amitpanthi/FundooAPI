const express = require("express")
const noteControls = require("../controller/noteControls")

const noteRouter = express.Router()

noteRouter.post("/addNotes", noteControls.postANote)
noteRouter.get("/getNotesList", noteControls.getNotesList)
noteRouter.patch("/deleteNote/:id", noteControls.deleteNode)
noteRouter.patch("/archiveNote/:id", noteControls.archiveNote)

module.exports = noteRouter