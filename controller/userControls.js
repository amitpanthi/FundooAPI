const User = require("../models/User")
const { validationResult, check } = require("express-validator")
const logger = require("../logger/logger")
const DEFAULT_LOG_STRING = `${new Date().toLocaleString()}: `
const bcrypt = require("bcrypt")

let userControls = {
    async forgotPass(request, response, next){
        try{
            let user = await User.findOne({email: request.body.email})

            if(user){
                logger.info(DEFAULT_LOG_STRING + `Got User: ${user}`)
                response.status(200).json(user)
                next()
            } else {
                logger.error(DEFAULT_LOG_STRING + `Enter valid email ID`)
                response.status(404).json({message:"Enter valid email ID"})
            }
        } catch(err) {
            logger.error(DEFAULT_LOG_STRING + `Status 500: ${err.message}`)
            response.status(500).json({ message:err.message })
        }
    },

    async resetPass(request, response){
        try{
            await User.updateOne({_id: request.params.id}, {$set: {password: request.body.password}})
            logger.info(DEFAULT_LOG_STRING + `Successfully resetted password`)
            response.status(200).json({"message": "OK"})
        } catch(err) {
            logger.error(DEFAULT_LOG_STRING + `Status 500: ${err.message}`)
            response.status(500).json({ message:err.message })
        }
    },

    async getUsers(request, response){
        try{
            const user = await User.find()
            logger.info(DEFAULT_LOG_STRING + "Successfully queried all users")
            response.status(200).json(user)
        } catch(err) {
            logger.error(DEFAULT_LOG_STRING + `Status 500: ${err.message}`)
            response.status(500).json({ message:err.message })
        }
    },

    async getUserByEmail(request, response, next){
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
        
        try{
            user = await User.find({email:request.body.email})
            logger.info(DEFAULT_LOG_STRING + `Query Result: ${user}`)
            if(user.length != 0){
                let passMatch = bcrypt.compare(request.body.password, user[0].password)

                if(passMatch){
                    logger.info(DEFAULT_LOG_STRING + `Status 200: Successfully queried\n${user}`)
                    return response.status(200).json(user)
                } else {
                    logger.info(DEFAULT_LOG_STRING + `Invalid credentials!`)
                    return response.status(404).json({ message:"Invalid credentials! User not found." })
                }
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
        let hashedPass = await bcrypt.hash(request.body.password, 10)
        const user = new User({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hashedPass
        })

        if(response.user.length != 0){
            logger.error(DEFAULT_LOG_STRING + `Status 422: User already exists.`)
            response.status(422).json({message: "User already exists"})
        } 
        else {
            try{
                const newUser = await user.save()
                logger.info(DEFAULT_LOG_STRING + `Successfully signed up: ${user}`)
                return response.status(201).json(newUser)
            } catch(err) {
                logger.error(DEFAULT_LOG_STRING + `Status 400: ${err.message}.`)
                return response.status(400).json({ message: err.message })
            }
        }
    },

    validateUser(request, response, next){
        const errors = validationResult(request)

        if(errors.isEmpty()){
            next()
        }
        
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
        logger.error(DEFAULT_LOG_STRING + `Status 422: ${{errors: extractedErrors}}`)
        return response.status(422).json({
            errors: extractedErrors
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