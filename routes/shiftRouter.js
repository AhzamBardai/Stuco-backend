import express from "express";
import Shift from "../models/Shift.js";
import User from "../models/User.js";
import { getIp } from "./validation.js";
import RequestIp from '@supercharge/request-ip'

const shiftRouter = express.Router()

shiftRouter

    // show all shifts ----------------------------
    .get('/', (req, res, next) => {
        Shift.find({})
            .then(shifts => res.json(shifts))
            .catch(next)
    })
    
    // put in socket
    // post -------------------------------------
    .post('/new', async (req, res, next) => {
        try {
            const user = User.findById(req.body.userId)
            if(user.isAdmin || user.superUser){
                try {
                    const newShift = await Shift.create(req.body)
                    if(newShift) res.json({message: 'Shift successfully created'})
                    
                } catch (error) {
                    res.json({message: 'Shift could not be created'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to make shifts.'})
        }
        
    })

    
    // show shifts by user -----------------------------
    .get('/:id', (req, res, next) => {
        Shift.find({ assignedTo: req.params.id})
        .then(shifts => res.json(shifts))
        .catch(next)
    })
    
    
    // edit shifts ---------------------------------------
    .put('/:id', async (req, res, next) => {
        try {
            const user = User.findById(req.body.userId)
            if(user.isAdmin || user.superUser){
                try {
                    const newShift = await Shift.findByIdAndUpdate({ _id: req.params.id}, req.body, {new: true})
                    if(newShift) res.json({message: 'Shift successfully updated'})
                    
                } catch (error) {
                    res.json({message: 'Shift could not be updated'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to update shifts.'})
        }
        
    })
    
    
    // delete shifts ----------------------------------------
    .delete('/:id', async (req, res, next) => {
        try {
            const user = User.findById(req.body.userId)
            if(user.isAdmin || user.superUser){
                try {
                    const newShift = await Shift.findByIdAndDelete(req.params.id)
                    if(newShift) res.json({message: 'Shift successfully deleted'})
                    
                } catch (error) {
                    res.json({message: 'Shift could not be deleted'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to delete shifts.'})
        }
        
    })
    
    // start shift ----------------------------------------
    .put('/:id/start', async (req, res, next) => {
        try {
            
            const user = User.findById(req.body.userId)
            const shift = Shift.findById(req.params.id)
            if(user.isAdmin || user.superUser || user._id == shift.assignedTo){
                try {
                    if(user.superUser){
                        const newShift = await Shift.findByIdAndUpdate({_id: req.params.id}, {startedAt: req.body.startedAt}, {new: true})
                        if(newShift) res.json({message: 'Shift started successfully'})
                    }
                    // verify shift start ip address here
                    else {
                        const myIp = getIp(req)
                        const superIp = RequestIp.getClientIp(req)
                        const newShift = await Shift.findByIdAndUpdate({_id: req.params.id}, {startedAt: req.body.startedAt}, {new: true})
                        if(newShift) res.json({message: 'Shift started successfully'})    
                    }
                    
                } catch (error) {
                    res.json({message: 'Shift could not start'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to start this shift.'})
        }
    })

    // end shift -----------------------------------------------
    .put('/:id/end', async (req, res, next) => {
        try {
            
            const user = User.findById(req.body.userId)
            const shift = Shift.findById(req.params.id)
            if(user.isAdmin || user.superUser || user._id == shift.assignedTo){
                try {
                    if(user.superUser){
                        const newShift = await Shift.findByIdAndUpdate({_id: req.params.id}, {endedAt: req.body.endedAt}, {new: true})
                        if(newShift) res.json({message: 'Shift ended successfully'})
                    }
                    // verify shift start ip address here
                    else {
                        const myIp = getIp(req)
                        const superIp = RequestIp.getClientIp(req)
                        const newShift = await Shift.findByIdAndUpdate({_id: req.params.id}, {endedAt: req.body.endedAt}, {new: true})
                        if(newShift) res.json({message: 'Shift ended successfully'})    
                    }
                    
                } catch (error) {
                    res.json({message: 'Shift could not end'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to start this shift.'})
        }
    })

export default shiftRouter