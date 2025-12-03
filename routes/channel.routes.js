import { createChannel, deleteChannel, editChannel, getChannel, subscribeChannel } from "../controllers/channel.controllers.js";
import verifyToken from "../middlewares/verify.js";
import { upload } from "../middlewares/upload.js";
export default function channelRoutes(app){
    app.get('/channels/:id',verifyToken,getChannel);
    app.post('/channels', verifyToken, upload.single("channelBanner"), createChannel);
    app.patch('/channels/:id',verifyToken,editChannel);
    app.delete('/channels/:id',verifyToken,deleteChannel);
    app.post("/channels/:id/subscribe", verifyToken, subscribeChannel);
}