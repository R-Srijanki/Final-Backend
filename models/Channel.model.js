import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    avatar: { type: String },
    channelBanner: { type: String },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true
    },

    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video" 
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);