import express from "express";
import Announcement from "../models/Announcement.js";
import User from "../models/User.js";

const announcementRouter = express.Router()

announcementRouter

    // show all Announcements ----------------------------
    .get('/', (req, res, next) => {
        Announcement.find({})
            .sort({updatedAt: -1})
            .then(announcements => res.json(announcements))
            .catch(next)
    })

    // put in socket
    // post -------------------------------------
    .post('/new', async (req, res, next) => {

        try {
            const user = User.findById(req.body.userId)
            if(user.isAdmin || user.superUser){
                try {
                    const newAnn = await Announcement.create(req.body)
                    if(newAnn) res.json({message: 'Announcement successfully created'})
                    
                } catch (error) {
                    res.json({message: 'Announcement could not be created'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to make announcements.'})
        }        
    })
    
    // show one Announcement -----------------------------
    .get('/:id', (req, res, next) => {
        Announcement.find({_id:req.params.id})
            .then(announcement => res.json(announcement))
            .catch(next)
    })

    // edit Announcements ---------------------------------------
    .put('/:id', async (req, res, next) => {
        try {
            const user = User.findById(req.body.userId)
            if(user.isAdmin || user.superUser){
                try {
                    const newAnn = await Announcement.findByIdAndUpdate({ _id: req.params.id}, req.body, {new: true})
                    if(newAnn) res.json({message: 'Announcement successfully updated'})
                    
                } catch (error) {
                    res.json({message: 'Announcement could not be updated'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to make announcements.'})
        }        
    })

    // delete Announcements ----------------------------------------
    .delete('/:id', async (req, res, next) => {

        try {
            const user = User.findById(req.body.userId)
            if(user.isAdmin || user.superUser){
                try {
                    const newAnn = await Announcement.findByIdAndDelete(req.params.id)
                    if(newAnn) res.json({message: 'Announcement successfully deleted'})
                    
                } catch (error) {
                    res.json({message: 'Announcement could not be deleted'})
                }
            }
        } catch (error) {
            res.json({message: 'You are not authorized to make delete announcements'})
        }        
        
    })

export default announcementRouter