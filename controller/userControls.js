const User = require("../models/User")
const { validationResult, check } = require("express-validator")
const logger = require("../logger/logger")
const DEFAULT_LOG_STRING = `${new Date().toLocaleString()}: `

let userControls = {
    async getUserByEmail(request, response, next){
        let user

        try{
            user = await User.find({email:request.body.email})
        } catch (err) {
            logger.error(DEFAULT_LOG_STRING + `Status 500: ${err.message}`)
            return res.status(500).json({ message:err.message })
        }

        response.user = user
        next()
    },

    async findUserByCredentials(request, response){
        let user
        console.log(user)
        try{
            user = await User.find({email:request.body.email, password:request.body.password})
            logger.info(DEFAULT_LOG_STRING + `Query Result: ${user}`)
            if(user.length != 0){
                logger.info(DEFAULT_LOG_STRING + `Status 200: Successfully queried\n${user}`)
                return response.status(200).json(user)
            } else {
                logger.error(DEFAULT_LOG_STRING + `Status 404: Invalid credentials! User not found.`)
                return response.status(404).json({ message:"Invalid credentials! User not found." })
            }
        } catch (err) {
            logger.error(DEFAULT_LOG_STRING + `Status 404: Invalid credentials! User not found.`)
            return response.status(404).json({ message: err.message })
        }
    },

    async signUpUser(request, response){
        const user = new User({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: request.body.password
        })


        if(response.user.length != 0){
            logger.error(DEFAULT_LOG_STRING + `Status 422: User already exists.`)
            response.status(422).json({message: "User already exists"})
        } 
        else {
            try{
                const newUser = await user.save()
                logger.info(DEFAULT_LOG_STRING + `Successfully signed up: ${user}`)
                response.status(201).json(newUser)
            } catch(err) {
                logger.error(DEFAULT_LOG_STRING + `Status 400: ${err.message}.`)
                response.status(400).json({ message: err.message })
            }
        }
    },

    validateUser(request, response, next){
        const errors = validationResult(request)

        if(errors.isEmpty()){
            next()
        }

        console.log(errors)
        
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
        logger.error(DEFAULT_LOG_STRING + `Status 422: ${{errors: extractedErrors}}`)
        return response.status(422).json({
            errors: extractedErrors,
          })
    },

    validateRules(){
        return [
            check("firstName")
            .not().isEmpty()
            .withMessage("First Name is required")
            .isAlpha()
            .withMessage("First Name should only contain alphabetical characters")
            .isLength({min:3})
            .withMessage("First Name should atleast have 3 characters"),
    
            check("lastName")
            .not().isEmpty()
            .withMessage("Last Name is required")
            .isAlpha()
            .withMessage("Last Name should only contain alphabetical characters")
            .isLength({min:3})
            .withMessage("Last Name should atleast have 3 characters"),
    
            check("email")
            .isEmail()
            .withMessage("Please enter a valid Email-ID"),
    
            check("password")
            .isLength({min:3})
            .withMessage("Password must have atleast 3 characters"),
        ]
    }
    
}

module.exports = userControls