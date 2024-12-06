import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface representing a document in MongoDB.
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  password: string;
}

// Create a Schema corresponding to the document interface.
const userSchema: Schema<IUser> = new Schema(
  {
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
  },
  { timestamps: true }
);

// Create a Model.
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
