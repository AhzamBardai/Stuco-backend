import mongoose from "../db/connection.js";

const themeSchema = new mongoose.Schema(
    {
        colorName : { type: String, required: true, trim: true },

        primaryColor : {
            main: { type: String, required: true, trim: true },
            light: { type: String, default: '', trim: true },
            dark: { type: String, default: '', trim: true },
            contrastText: { type: String, default: '', trim: true },
        },
        secondaryColor : {
            main: { type: String, required: true, trim: true },
            light: { type: String, default: '', trim: true },
            dark: { type: String, default: '', trim: true },
            contrastText: { type: String, default: '', trim: true },
        },

        current : { type: Boolean, default: false }

    },
    { timestamps: true }
)

themeSchema.pre('save', (next) => {
    const name = this.colorName
    this.colorName = name.indexOf(' ') >= 0 ? name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') : name.charAt(0).toUpperCase() + name.slice(1)
    next()
})

export default mongoose.model('theme', themeSchema)