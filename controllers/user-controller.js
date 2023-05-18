const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

//REGISTER / SIGNUP
const signup = async (req, res) => {
    //VALIDATE EMAIL
    const { name, email, password } = req.body
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (error) {
        console.log(error)
    }
    if(existingUser) res.status(400).json({ message: 'User already exists'})


    //hash password
    const hashedPassword = bcrypt.hashSync(password)

    const newUser = new User({
        name,
        email,
        password: hashedPassword
    })

    try {
        const user = await newUser.save()
        res.status(201).json({ message: user })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}





//LOGIN
const login = async (req, res) => {
    const { email, password } = req.body
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
        console.log(existingUser)
    } catch (error) {
        return new Error(error)
    }
    if(!existingUser) res.status(400).json({ message: 'User not found. Signup please!'})

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
    if(!isPasswordCorrect) res.status(400).json({ message: 'Invalid Email / Password' })
    
    const token = jwt.sign({ id: existingUser._id}, process.env.JWT_SECRET_KEY, { expiresIn: 3600 })
    return res.status(200).json({ message: 'Successfully Logged In', user: existingUser, token })
}


//MIDDLEWARE VERIFY USER
const verifyToken = (req, res, next) => {
    const headers = req.headers['authorization']
    // Beaer [Token]
    const token = headers.split(' ')[1]

    if(!token) res.status(404).json({ message: 'No token found'})
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) res.status(400).json({ message: 'Invalid Token' })
        console.log(user.id)
        req.id = user.id
    })
    next()
}


const getUser = async (req, res) => {
    const userId = req.id
    let user
    try {
        user = await User.findById(userId, '-password')
    } catch (error) {
        return new Error(error)
    }
    if(!user) { 
        return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ user })
}


module.exports = { signup, login, verifyToken, getUser }