import User from "../models/User.js";
import bcrypt from 'bcrypt'
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()


export const getIp = (req) => req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip

// validate use info at sign up
export const validateUser = (user) => {
    return validator.isEmail(user.email) && /^[A-Za-z\s]+$/.test(user.fullName)
}

// delete user
export const deleteUser = async (id) => {
    try {
        const deleteUser = await User.findByIdAndDelete({_id: id})
        if(deleteUser) return {message: 'User deleted'}
        else return {message: 'User could not be deleted'}
        
    } catch (error) {
        return {message: 'User delete error'}
    }
}

// update user
export const updateUser = async (id, payload) => {
    try {
        const update = await User.findByIdAndUpdate({_id: id}, payload, {new: true})
        if(update) return update
        else return {message: 'User could not be updated'}
        
    } catch (error) {
        return {message: 'User update error'}
    }
}

// check if member
export const checkMember = async (id) => {
    try {
        return await User.findById(id).then(user => user ? !user.isAdmin && !user.superUser : false)
        
    } catch  {
        return false
    }
}

export const checkAdmin = async (id) => {
    try {
        return await User.findById(id).then(user => user ? user.isAdmin && !user.superUser : false)
        
    } catch  {
        return false
    }
}

export const permission = () => {
    return {message: 'You do not have permission to update this user.'}
}
