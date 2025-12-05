import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(req,res) {
    try{
        // console.log("infunction");
        const {fullName,username,email,password}=req.body;//get field data from body
        if(!fullName||!username || !email ||!password) //if any fields data missing return
            return res.status(400).json({"message":"Missing fields"});
        //console.log(name,email,password);//find if user exists
        const exists=await User.findOne({email});
        //console.log(exists);
        const exists1=await User.findOne({username});
        if(exists1) //if exists then return 
            return res.status(400).json({message:"Username already in use"});
        if(exists) //if exists then return 
            return res.status(400).json({message:"Email already in use"});
        //create new user with given data of each fields
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
        const newUser=await User.create({username,email,fullName,avatar:avatarUrl,
            password:bcrypt.hashSync(password,12),//hash password when sent to database so it won't be easy to guess
            //second parameter is saltrounds means how many times it is hashed
        });
       // console.log(newUser);//send result of created user
        res.status(201).json({newUser});
    }//error occured during register goes to catch block
    catch(err){
        return res.status(500).json({"error occured during registering user":err.message});
    }
    
}

export async function loginUser(req,res) {
    try{
        const {username,email,password}=req.body;//get field data from body
        if(!username||!email ||!password)//if any data missing then return
            return res.status(400).json({"message":"Missing fields"});
        //find user with given details
        const exists = await User.findOne({ $or: [{ email }, { username }] }).populate("channel","handle");
        if(!exists)//if user is not registered then return
            return res.status(401).json({message:"Invalid email or username"});
        //compare hashed password with typed password 
        let validPassword=bcrypt.compareSync(password,exists.password);
        if(!validPassword){ //if not matched then wrong password
            return res.status(401).json({"message":"Incorrect password"});
        }
        //create token with data, secret key, access to it expiresIn
        let token=jwt.sign({id:exists.id},"SECRETKEY",{expiresIn:"7d"});
        //return user details as response with token 
        return res.status(200).json({
            user:{
                _id:exists._id,
                username:exists.username,
                email:exists.email,
                avatar:exists.avatar,
                fullName:exists.fullName,
                channel:exists.channel
            },
            accessToken:token,
        });
    }//error during login goes to catch block
    catch(err){
          return res.status(500).json({
            message: "Error occurred during login",
            error: err.message
        });
    }
}