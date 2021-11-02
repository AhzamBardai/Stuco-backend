import Theme from '../models/Theme.js'
import express from 'express'

const themeRouter = express.Router()

themeRouter 
    .get('/', (req, res, next) => {
        Theme.find({})
            .then(themes => res.json(themes))
            .catch(next)
    })

    .post('/new', (req, res, next) => {
        Theme.create(req.body)
            .then(() => res.redirect('/'))
            .catch(next)
        next()
    })

    .get('/current', (req, res, next) => {
        Theme.findOne({current : true})
            .then(theme => res.json(theme))
            .catch(next)
    })

    .put('/setTheme/:id', async (req, res, next) => {
        try {
            const currentTheme = await Theme.findOne({ current : true })
            await Theme.updateMany({}, { current : false })
            const updateOne = await Theme.findOneAndUpdate({ _id : req.params.id}, { current : true }, { new : true})
            const whichUpdate = updateOne ? updateOne : currentTheme
            res.json(whichUpdate)
        } catch (error) {
            next()
        }
    })

    .put('/:id', (req, res, next) => {
        Theme.findByIdAndUpdate({ _id : req.params.id}, req.body, {new : true})
            .then(() => res.json({ message: 'Theme Update Successful' }))
            .catch(next)
    })

    .delete('/:id', (req, res, next) => {
        Theme.findByIdAndDelete({ _id : req.params.id})
            .then(themes => res.json(themes))
            .catch(next)
    })

export default themeRouter