require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()
mongoose.connect("mongodb://localhost/fundoo")

app.use(express.json())

const usersRouter = require("./routes/userRoutes.js")
app.use("/user", usersRouter)

app.listen(3000, () => {console.log("Server Started!")})