import mongoose from "mongoose";
//video schema 
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    thumbnailUrl: {
      type: String,
      required: true
    },

    videoUrl: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "General"
    },

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },

    views: {
      type: Number,
      default: 0
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
//export video model
export default mongoose.model("Video", videoSchema);