import { createChannel, deleteChannel, editChannel, getChannel } from "../controllers/channel.controllers.js";
import verifyToken from "../middlewares/verify.js";

export default function channelRoutes(app){
    app.get('/channels/:id',verifyToken,getChannel);
    app.post('/channels',verifyToken,createChannel);
    app.put('/channels/:id',verifyToken,editChannel);
    app.delete('/channels/:id',verifyToken,deleteChannel);
}