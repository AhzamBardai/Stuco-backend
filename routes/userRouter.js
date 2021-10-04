import express from "express";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validateUser, deleteUser, checkMember, updateUser, permission} from "./validation.js";
import dotenv from 'dotenv'

dotenv.config()
const userRouter = express.Router()

    // // get one - admin
    // userRouter.post('/one', async (req, res, next) => {

    // })

    // get one user - login ----------------------
    userRouter.post('/login', async (req, res, next) => {
        // check if user exists
        try {
            // const user = await User.findOne({ $or: [{username: req.body.username}, {email: req.body.username} ]})
            const user = await req.body.username ? await User.findOne({username: req.body.username}) : await User.findOne({email: req.body.email})
            if(!user) res.json({message: 'Incorrect Username or Email'})
            
            const passValidation = await bcrypt.compare(req.body.password, user.password)
            if(!passValidation) res.json({message: 'Incorrect Password'})
            
            else {
                    const token = jwt.sign({user: user}, process.env.TOKEN_SECRET_KEY, { expiresIn: '15m' })
                    res.json({jwt: token, refresh: user.token})
                }   
                
            } catch (error) {
                next()
            }
        })
        
    // get data by existing jwt
    userRouter.get('/data', (req, res, next) => {
        // verify token and send data back
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && {jwt: authHeader.split(' ')[1]}
            
            if (token == null) res.json({message: 'invalid token format'})
            
            const data = jwt.verify(token.jwt, process.env.TOKEN_SECRET_KEY)
            
            if(!data) res.json({message: 'Token expired'})
            
            // const keys = Object.fromEntries(Object.entries(data.user).filter(([key, value]) => key != '_id'))
            
            res.json(data.user)
            
        } catch (error) {
            res.json({message: 'Error getting data userRouter'})
            next()
        }
    })
    
    // make new jwt with refresh token
    userRouter.post('/token', (req, res, next) => {
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
                res.json({message: 'error in userRouter token'})
                next()
            }
        })
    })
    
    // create user - sign up --------------------------------
    userRouter.post('/new', async (req, res, next) => {
        try {
            // check if user exists
            const item = await User.findOne({ $or: [{username: req.body.username}, {email: req.body.email} ]})
            if(item) res.json({message: 'User Already exists'})
            console.log(item)
            // validate user and create
            if(validateUser(req.body) ){
                const user = await User.create(req.body)
                const hash = await bcrypt.hash(`${user._id}`, 8)
                const token = jwt.sign({id: hash}, process.env.TOKEN_REFRESH_KEY)
                
                await User.findByIdAndUpdate(user._id, {token: token})
                res.json({refresh: token})
                next()   
            }
            
        } catch (error) {
            res.json({message: 'error in userRouter signup'})
            next()
        }
    })

 
    
    // Update user ------------------------------------------------------
    userRouter.put('user/:id', (req, res, next) => {
        res.json(updateUser(req.params.id, req.body))
        next()
    })
    
    // Update by admin ---------------------------------------------------
    userRouter.put('admin/:id', (req, res, next) => {
        User.findById(req.params.id)
        .then(user => {
            
            if(user.superUser){
                res.json(updateUser(req.body.updateId, req.body))
            } else if(user.isAdmin && checkMember(req.body.updateId)) {
                
                if(req.body.superUser){
                    res.json(permission())
                }
                else {
                    res.json(updateUser(req.body.updateId, req.body))
                }
            }
            else {
                res.json(permission())
            }
            
        })
        .catch(() => res.json({message: 'Error in update user router'}))
        .finally(next)
    })
    
    // delete ------------------------------------------------------------
    userRouter.delete('user/:id', (req, res, next) => {
        res.json(deleteUser(req.params.id))
        next()
    })
    
    // delete by admin ----------------------------------------------------
    userRouter.delete('admin/:id', (req, res, next) => {
        User.findById(req.params.id)
        .then(user => {
            if(user.superUser){
                res.json(deleteUser(req.body.deleteId))
            } else if(user.isAdmin && checkMember(req.body.deleteId)) {
                
                res.json(deleteUser(req.body.deleteId))
            }
            else {
                res.json(permission())
            }
            
        })
        .catch(() => res.json({message: 'Error in update user router'}))
        .finally(next)
    })
    
    // change home color -------------------------------
    userRouter.put('/color/:id', (req, res, next) => {
        User.findById(req.params.id)
        .then(user => {
            if(user.superUser || user.isAdmin){
                User.updateMany({}, {homeColor: req.body.color})
                .then(() => res.json('Color updated for all users'))
                    .catch(() => res.json('Color could not be updated'))
                    .finally(next)

                }
                else res.json(permission())
            })
        .catch(() => res.json({message: 'error in color userRouter'}))
        .finally(next)
    })

    // get one by id ------------------------------------------------
    userRouter.get('/one/:id', (req, res, next) => {
        User.findById({_id: req.params.id})
            .then(user => res.json(user))
            .catch(err => console.log(err))
    })
    
    // show all ----------------------------------------------------
    userRouter.get('/:id', (req, res, next) => {
        User.findById({_id: req.params.id})
        .then(user => {
            // show all user that are superusers, admins and members
            if(user.superUser){
                User.find({},{password: 0})
                .then(users => res.json(users))
                .catch(() => res.json({message: 'No users found'}))
                .finally(next)        
            } 
            
            // show all users that are admin and members
            else if(user.isAdmin){
                User.find({superUser: false}, {password: 0})
                .then(users => res.json(users))
                .catch(() => res.json({message: 'No users found'}))
                .finally(next)
            }
            else {
                res.json(permission())
            }
        })
        .catch((err) => console.log(err))
    })

    export default userRouter