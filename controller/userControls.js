const User = require("../models/User")
const { validationResult, check } = require("express-validator")

let userControls = {
    async getUserByEmail(request, response, next){
        let user

        try{
            user = await User.find({email:request.body.email})
        } catch (err) {
            return res.status(500).json({ message:err.message })
        }

        response.user = user
        next()
    },

    async findUserByCredentials(request, response){
        let user
        
        try{
            user = await User.find({email:request.body.email, password:request.body.password})
            console.log(user)
            if(user.length != 0){
                return response.status(200).json(user)
            } else {
                return response.status(404).json({ message:"Invalid credentials! User not found." })
            }
        } catch (err) {
            return response.status(404).json({ message:"User not found" })
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
            response.status(422).json({message: "User already exists"})
        } 
        else {
            try{
                const newUser = await user.save()
                response.status(201).json(newUser)
            } catch(err) {
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