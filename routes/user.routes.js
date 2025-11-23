import verifyToken from "../middlewares/verify.js";
import { loginUser,registerUser } from "../controllers/user.controllers.js";
export default function userRoutes(app){
    app.post('/login',verifyToken,loginUser);
    app.post('/register',verifyToken,registerUser);
}