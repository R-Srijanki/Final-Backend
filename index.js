import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import videoRoutes from "./routes/video.routes.js";
import channelRoutes from "./routes/channel.routes.js";
const app=express();//create server
app.use(cors());//allows access to different domains 
app.use(express.json());//convert to json format
app.use(express.urlencoded({
    extended: false
}));
//connection with database with help of mongoose
mongoose.connect("mongodb+srv://jankirathod999_db_user:FTZX2f2LGjqYvuSo@cluster0.dcefapd.mongodb.net/");
//to determine successful or unsuccesful connection with db
const db=mongoose.connection;
db.on("open",()=>{
    console.log("Connection successful");
});

db.on("error",()=>{
    console.log("Connection not successful");
});
//routes of user,video,comment,channel
userRoutes(app);
videoRoutes(app);
commentRoutes(app);
channelRoutes(app);
//listen on port 8000
app.listen(8000,()=>{
    console.log("Server listening on port 8000");
})
