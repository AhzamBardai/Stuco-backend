import mongoose from "mongoose";

const mongoURI = process.env.NODE_ENV == 'production' ? process.env.DB_URL : 'mongodb://localhost/Stuco'

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 100,
    autoIndex: true
    })
    .then((db) => console.log(`Connected to db: ${db.connections[0].name}`))
    .catch((err) => console.log(err))

export default mongoose