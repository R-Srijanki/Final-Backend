import verifyToken from "../middlewares/verify.js";
import { loginUser,registerUser } from "../controllers/user.controllers.js";
export default function userRoutes(app){
    app.post('/login',loginUser);//api to login user
    app.post('/register',registerUser);//api to register user and send to database
}