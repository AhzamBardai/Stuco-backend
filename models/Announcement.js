import mongoose from '../db/connection.js'

const announcementSchema = mongoose.Schema(
    {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

        title: { type: String, default: 'untitled', trim: true },

        image: [{ type: String }],

        file: [{ type: String }],

        body: { type: String, required: true  }
    }
)

export default mongoose.model('announcement', announcementSchema)