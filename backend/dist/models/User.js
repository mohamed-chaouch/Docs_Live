import mongoose, { Schema } from "mongoose";
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
}, { timestamps: true });
// Create a Model.
const User = mongoose.model("User", userSchema);
export default User;
