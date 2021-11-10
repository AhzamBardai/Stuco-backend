import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";

// routes
import shiftRouter from './routes/shiftRouter.js'
import userRouter from './routes/userRouter.js'
import announcementRouter from './routes/announcementRouter.js'
import themeRouter from './routes/themeRouter.js'

dotenv.config()

const app = express()
// add BACKEND URL ENV !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const corsOrigin = process.env.NODE_ENV === 'production' ? 'https://plano-stuco.herokuapp.com' : 'http://localhost:3000'
app.use(cors({ origin : corsOrigin, credentials: true }))
app.use(helmet())
app.use(bodyParser.json({ extended: true, limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

// routes
app.use('/api/users', userRouter)
app.use('/api/shifts', shiftRouter)
app.use('/api/announcements', announcementRouter)
app.use('/api/themes', themeRouter)

// port
const port = process.env.PORT || 4000
app.listen(port, () => console.log(`App listening on: ${port}`))
