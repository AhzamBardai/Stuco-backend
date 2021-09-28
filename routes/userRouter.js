import express from "express";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validateUser, deleteUser, checkMember} from "./validation.js";
import dotenv from 'dotenv'

dotenv.config()
const userRouter = express.Router()

userRouter

    // change home color -------------------------------
    .put('/color', (req, res, next) => {
        User.updateMany({}, {homeColor: req.body.color})
            .then(() => res.json('Color updated for all users'))
            .catch(() => res.json('Color could not be updated'))
            .finally(next)
    })

    // got one user - login ----------------------
    .post('/login', async (req, res, next) => {
        // check if user exists
        try {
            const user = await User.findOne({ $or: [{username: req.body.username}, {email: req.body.email} ]})
            if(!user) res.json({message: 'Incorrect Username or Email'})

            const passValidation = bcrypt.compare(req.body.password, user.password)
            if(!passValidation) res.json({message: 'Incorrect Password'})

            else {
                const token = jwt.sign({user: user}, process.env.TOKEN_SECRET_KEY, { expiresIn: '15m' })
                res.json({jwt: token})
            }   
            
        } catch (error) {
            res.json({message: 'Error getting user'})
        }
    })

    // get data by existing jwt
    .get('/data', (req, res, next) => {
        // verify token and send data back
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && {jwt: authHeader.split(' ')[1]}
    
            if (token == null) res.json({message: 'invalid token format'})
    
            const data = jwt.verify(token.jwt, process.env.TOKEN_SECRET_KEY)
    
            res.json(data.user)
            
        } catch (error) {
            res.json({message: 'Token expired'})
        }
    })

    // make new jwt with refresh token
    .post('/token', (req, res, next) => {
        jwt.verify(req.body.jwt, process.env.TOKEN_REFRESH_KEY, async (err, user) => {
            if(err) res.json({message: 'invalid token'})
            try {
                const data = await User.find({}, { _id: 1 })
                for(var i=0; i<data.length; i++) {
                    const bool = await bcrypt.compare(`${data[i]._id}`, user.id)
                    if(bool) {
                        const user = await User.findById(data[i]._id)
                        const token = jwt.sign({user: user}, process.env.TOKEN_SECRET_KEY, { expiresIn: '15m' })
                        res.json({jwt: token})
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
    })

    // create user - sign up --------------------------------
    .post('/new', async (req, res, next) => {
        try {
            // check if user exists
            const item = await User.findOne({ $or: [{username: req.body.username}, {email: req.body.email} ]})
            if(item) res.json({message: 'User Already exists'})

            // validate user and create
            if(validateUser(req.body) ){
                const user = await User.create(req.body)
                const hash = await bcrypt.hash(`${user._id}`, 8)
                const token = jwt.sign({id: hash}, process.env.TOKEN_REFRESH_KEY)

                await User.findByIdAndUpdate(user._id, {token: token})
                res.json({refresh: token})
                next()   
            }
            else {
                res.json({message: 'Username or email format incorrect'})
                next()
            }
        } catch (error) {
            console.log(error)
            next()
        }
    })

    // show all ----------------------------------------------------
    .get('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .then(user => {

                // show all user that are superusers, admins and members
                if(user.superUser){
                    User.find({})
                    .then(users => res.json(users))
                    .catch(() => res.json({message: 'No users found'}))
                    .finally(next)        
                } 

                // show all users that are admin and members
                else if(user.isAdmin){
                    User.find({}, null, {superUser: false})
                    .then(users => res.json(users))
                    .catch(() => res.json({message: 'No users found'}))
                    .finally(next)
                }
            })
    })

    // Update user ------------------------------------------------------
    .put('/:id', (req, res, next) => {
        User.findByIdAndUpdate({_id: req.params.id}, req.body, {new:true})
            .then(user => res.json(user))
            .catch(() => res.json({message: 'User could not be updated'}))
            .finally(next)
    })

    // delete ------------------------------------------------------------
    .delete('/:id', (req, res, next) => {
        res.json(deleteUser(req.params.id))
        next()
    })

    // delete admin ----------------------------------------------------
    .delete('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .then(user => {
                if(user.superUser){
                    res.json(deleteUser(req.body.deleteId))
                    next()
                } else {

                    if(checkMember(req.body.deleteId)){
                        res.json(deleteUser(req.body.deleteId))
                        next()  
                    }
                    else {
                        res.json({message: 'You do not have authority to delete this user.'})
                        next()
                    }
                }
            })
    })

export default userRouter