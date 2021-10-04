import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv'

// routes
import shiftRouter from './routes/shiftRouter.js'
import userRouter from './routes/userRouter.js'
import announcementRouter from './routes/announcementRouter.js'

dotenv.config()

const app = express()
// add cors origins !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.use(cors())
app.use(bodyParser.json({ extended: true, limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))


// routes
app.use('/api/users', userRouter)
app.use('/api/shifts', shiftRouter)
app.use('/api/announcements', announcementRouter)


// port
const port = process.env.PORT || 4000
app.listen(port, () => console.log(`App listening on: ${port}`))
