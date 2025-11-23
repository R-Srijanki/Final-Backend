import mongoose from "mongoose";
import UserModel from "./User.model";
import VideoModel from "./Video.model";

const channelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true,
    },
    handle: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true
    },
    description:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    channelBanner:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:UserModel
    },
    subscribers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:UserModel
        }
    ],
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:VideoModel
        }
    ]
},
{
    timestamps:true
}
);

export default mongoose.model('Channel',channelSchema);