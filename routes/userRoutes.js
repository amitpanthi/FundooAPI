const express = require("express")
const userRouter = express.Router()
const userControls = require("../controller/userControls")

// Sign up
userRouter.post("/userSignUp", userControls.validateRules(), userControls.validateUser, userControls.getUserByEmail, userControls.signUpUser)

// Get User details on login route
userRouter.get("/login/", userControls.findUserByCredentials)

module.exports = userRouter