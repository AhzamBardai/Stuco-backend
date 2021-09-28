import mongoose from "../db/connection.js";

const shiftSchema = mongoose.Schema(
    {
        login: { type: Boolean, default: false },

        shiftOption: { 
            day: { type: String, required: true, trim: true },
            start: { type: String, required: true, trim: true },
            end: { type: String, required: true, trim: true } 
        },

        startedAt: { type: String, default: 'Not started yet'},

        endedAt: { type: String, default: 'Not ended yet' },

        attended: { type: Boolean, default: false },

        completed: { type: Boolean, default: false },

        approved: { type: Boolean, default: false },

        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

        assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

    }, 
    { timestamps: true }
)

export default mongoose.model('shift', shiftSchema)