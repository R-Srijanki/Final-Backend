import { createChannel, deleteChannel, editChannel, getChannel, subscribeChannel } from "../controllers/channel.controllers.js";
import verifyToken from "../middlewares/verify.js";
import { upload } from "../middlewares/upload.js";
export default function channelRoutes(app){
    //api to get channel details
    app.get('/channels/:id',verifyToken,getChannel);
    //api to create channel
    app.post('/channels', verifyToken, upload.single("channelBanner"), createChannel);
    //api to update specific fields in channel
    app.patch('/channels/:id',verifyToken, upload.single("channelBanner"),editChannel);
    //api to delete channel
    app.delete('/channels/:id',verifyToken,deleteChannel);
    //api to subscribe channel
    app.post("/channels/:id/subscribe", verifyToken, subscribeChannel);
}