import mongoose from "mongoose";
import UserModel from "./User.model.js";

const videoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    thumbnailurl:{
        type:String,
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        default: "General" 
    },
    uploader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:UserModel,
        required:true
    },
    channelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Channel,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:UserModel
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:UserModel
        }
    ],
     uploadDate:   { type: Date, default: Date.now },
},
{
    timestamps:true
}
);

export default mongoose.model('Video',videoSchema);
