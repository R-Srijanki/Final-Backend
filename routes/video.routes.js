import {getVideos,getVideo,uploadVideo,updateVideo,deleteVideo,likeVideo,dislikeVideo} from "../controllers/video.controllers.js";
import verifyToken from "../middlewares/verify.js";

export default function videoRoutes(app) {
  app.get("/videos", getVideos);//api to get all videos
  app.get("/videos/:id", getVideo);//api to get particular video details

  app.post("/videos", verifyToken, uploadVideo);//api to upload video to database
//api to update video details to database
  app.patch("/videos/:id", verifyToken, updateVideo);
//api to delete video from database
  app.delete("/videos/:id", verifyToken, deleteVideo);
//api to like video
  app.post("/videos/:id/like", verifyToken, likeVideo);
  //api to dislike video
  app.post("/videos/:id/dislike", verifyToken, dislikeVideo);
}