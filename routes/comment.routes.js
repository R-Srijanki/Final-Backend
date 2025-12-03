import { addComment, deleteComment, dislikeComment, editComment, getComments, likeComment } from "../controllers/comment.controllers.js";
import verifyToken from "../middlewares/verify.js";
export default function commentRoutes(app){
     // Fetch comments for a video
  app.get('/videos/:id/comments', getComments);

  // Add a new comment
  app.post('/videos/:id/comments', verifyToken, addComment);

  // Edit a comment
  app.patch('/videos/:id/comments/:commentId', verifyToken, editComment);

  // Delete a comment
  app.delete('/videos/:id/comments/:commentId', verifyToken, deleteComment);

  // Like a comment
  app.post('/videos/:id/comments/:commentId/like', verifyToken, likeComment);

  // Dislike a comment
  app.post('/videos/:id/comments/:commentId/dislike', verifyToken, dislikeComment);
}