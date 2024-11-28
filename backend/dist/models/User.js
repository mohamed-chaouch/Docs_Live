import mongoose, { Schema } from 'mongoose';
// Create a Schema corresponding to the document interface.
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    planId: {
        type: Number,
        default: 1,
    },
    creditBalance: {
        type: Number,
        default: 5,
    },
    totalImageGenerated: {
        type: Number,
        default: 0,
    },
    totalImagesManipulated: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });
// Create a Model.
const User = mongoose.model('User', userSchema);
export default User;
