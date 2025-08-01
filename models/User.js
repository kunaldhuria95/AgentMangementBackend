import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 5,
        maxlength: 20,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'please provide a valid email'
        }

    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});


// hash the password before saving if password not modified return
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()


})

//check if the hashed password is correct
userSchema.methods.comparePassword = async function (password) {

    try {
        console.log(password,"password")
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
        return false;
    }

}

//generates access token
userSchema.methods.generateAccessToken = function () {

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    return jwt.sign({
        _id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default mongoose.model('User', userSchema)