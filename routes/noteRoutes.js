const express = require("express")
const noteControls = require("../controller/noteControls")

const noteRouter = express.Router()

noteRouter.post("/addNotes", noteControls.postANote)
noteRouter.get("/getNotesList", noteControls.getNotesList)

module.exports = noteRouter