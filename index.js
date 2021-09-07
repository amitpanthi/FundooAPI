require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const swaggerUi = require('swagger-ui-express');

const app = express()
mongoose.connect("mongodb://localhost/fundoo")

const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json())

const usersRouter = require("./routes/userRoutes.js")
app.use("/user", usersRouter)

app.listen(3000, () => {console.log("Server Started!")})