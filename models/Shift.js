import mongoose from "../db/connection.js";

const shiftSchema = mongoose.Schema(
    {
        login: { type: Boolean, default: false },

        shiftOption: { 
            title: { type: String, required: true, trim: true },
            start: { type: String, required: true, trim: true },
            end: { type: String, required: true, trim: true } 
        },

        startedAt: { type: String, default: 'Not started yet'},

        endedAt: { type: String, default: 'Not ended yet' },

        attended: { type: Boolean, default: false },

        completed: { type: Boolean, default: false },

        approved: { type: Boolean, default: false },

        assignedTo: { type: String, required: true, trim: true },

        assignedBy: { type: String, required: true, trim: true },

    }, 
    { timestamps: true }
)

export default mongoose.model('shift', shiftSchema)