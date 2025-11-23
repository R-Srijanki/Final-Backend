import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./routes/user.routes.js";
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

mongoose.connect("mongodb+srv://jankirathod999_db_user:FTZX2f2LGjqYvuSo@cluster0.dcefapd.mongodb.net/");
const db=mongoose.connection;
db.on("open",()=>{
    console.log("Connection successful");
});

db.on("error",()=>{
    console.log("Connection not successful");
});
userRoutes(app);
app.listen(8000,()=>{
    console.log("Server listening on port 8000");
})

//jankirathod999_db_user
//FTZX2f2LGjqYvuSo