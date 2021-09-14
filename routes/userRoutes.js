const express = require("express")
const userRouter = express.Router()
const userControls = require("../controller/userControls")
const authFunctions = require("../services/auth")

// Sign up
userRouter.post("/userSignUp", userControls.validateRules(), userControls.validateUser, userControls.getUserByEmail, userControls.signUpUser)

// Get User details on login route
userRouter.get("/login/", authFunctions.createToken, userControls.findUserByCredentials)

userRouter.get("/getAllUsers", authFunctions.verifyToken, userControls.getUsers)

module.exports = userRouter