import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export default function verifyToken(req,res,next){
    try{
        //it checks if jwt token is send in headers in field authorization 
        if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]=='JWT'){
            //it decodes the token with secretkey 
            jwt.verify( req.headers.authorization.split(' ')[1], 'SECRETKEY',
                async function(err,verifyToken){
                if(err){// error occurs if invalid token is sent 
                    return res.status(403).json({message: "Invalid JWT token"})
                }
                //get data of user through decoded i.e id
                const data = await User.findById(verifyToken.id)
                req.user = data;     
                //go to next middleware or to route
                next();           
            });
        }//if token is not sent through header then returns below error
        else return res.status(403).json({message:"token not found"}); 
    }
    catch(err){
        return res.status(500).json({"error during verifying token":err.message});
    }
}