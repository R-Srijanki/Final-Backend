import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    },
    likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }],
    dislikes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }],
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);