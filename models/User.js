import mongoose from "../db/connection.js";
import bcrypt from 'bcrypt'


const userSchema = mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },

        username: { type: String, required: true, unique: true, trim: true },

        email: { type: String, required: true, unique: true, trim: true, lowercase: true },

        password: { type: String, required: true, trim: true },

        image: { type: String, default: '', trim: true },

        position: { type: String, default: 'Member', trim: true },

        options: {
            type: Array,
            default: ['Management', 'President', 'Vice President', 'Secretary', 'Media Co-Ordinator', 'Communications Officer', 'Activities Co-Ordinator', 'Regulations Officer', 'Member'] ,
            immutable: true
        },

        isApproved: { type: Boolean, default: false },
        
        isValidated: { type: Boolean, default: false },

        darkMode: { type: Boolean, default: false },

        homeColor: { type: String, default: '' },

        isAdmin: { type: Boolean, default: false },

        superUser: { type: Boolean, default: false },

        extraHours: { type: Number, default: 0},

        savedAnnouncements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],

        token: { type: String, default: '', trim: true },

    },
    { timestamps: true }
)

userSchema.pre("save", function (next) {
    // capitalize first letters in the full name
    const name = this.fullName
    this.fullName = name.indexOf(' ') >= 0 ? name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') : name.charAt(0).toUpperCase() + name.slice(1)
    this.email = this.email.toLowerCase()
    // hash password
    if(!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, 10, (err, passwordHash)=> {
        if(err) next(err)
        this.password = passwordHash
        next()
    })
})

export default mongoose.model('user', userSchema)