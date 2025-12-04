import mongoose from "mongoose";
//user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: "" // optional
    },
    password: {
      type: String,
      required: true
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel", 
      default: null   // user may not have channel yet
    }
  },
  { timestamps: true }
);
//export user model
export default mongoose.model("User", userSchema);