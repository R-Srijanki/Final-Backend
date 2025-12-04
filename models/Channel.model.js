import mongoose from "mongoose";
//channel schema
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
      type: String
    },
    avatar: { type: String },
    channelBanner: { type: String },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[]
      }
    ],

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        default:[]
      }
    ]
  },
  { timestamps: true }
);
//channel model
export default mongoose.model("Channel", channelSchema);