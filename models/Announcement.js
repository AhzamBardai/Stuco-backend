import mongoose from '../db/connection.js'

const announcementSchema = mongoose.Schema(
    {
        author: { type: String, required: true },

        authorImage: { type: String, default: '', trim: true },

        image: [{ type: String }],

        file: [{ type: String }],

        body: { type: String, required: true  }
    },
    { timestamps: true }
)

announcementSchema.pre("save", function (next) {
    // capitalize first letters in the full name
    this.body = this.body.charAt(0).toUpperCase() + this.body.slice(1)
    next()
})

export default mongoose.model('announcement', announcementSchema)