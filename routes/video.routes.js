import verifyToken from "../middlewares/verify";

export default function videoRoutes(app){
    app.get('/videos',getVideos);
    app.get('/videos/:id',getVideo);
    app.post('/videos',verifyToken,uploadVideo);
    app.put('/videos/:id',verifyToken,updateVideo);
    app.delete('/videos/:id',verifyToken,deleteVideo);
    app.post('/videos/:id/like',verifyToken,likeVideo);
    app.post('videos/:id/dislike',verifyToken,dislikeVideo);
}