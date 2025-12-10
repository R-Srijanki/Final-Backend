import CommentModel from "../models/Comment.model.js";
import Video from "../models/Video.model.js";
export async function getComments(req, res) {
  try {
    const { id: videoId } = req.params;
    //get id from url and find it in comment model
    const comments = await CommentModel.find({ video: videoId })
      .populate("user", "username fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while fetching comments",
      error: err.message,
    });
  }
}

export async function addComment(req, res) {
  try {
    const { id: videoId } = req.params;
    const { text } = req.body;
    //get id and text from req params and body
    if (!text)
      return res.status(400).json({ message: "Comment text is required" });
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });
    //add new comment to database by creating with given text
    const newComment = await CommentModel.create({
      video: videoId,
      user: req.user._id,
      text,
    });
    const populatedComment = await CommentModel.findById(
      newComment._id
    ).populate("user", "_id username avatar");
    //send updated comment with user details populated
    return res.status(201).json(populatedComment);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while adding comment",
      error: err.message,
    });
  }
}

export async function editComment(req, res) {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    //get id and text from req params and body
    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }
    const exists = await CommentModel.findById(commentId);
    if (!exists)
      return res.status(404).json({ message: "Comment does not exist" });

    // Only owner can edit
    if (!exists.user.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });
    //update text in comment
    const updated = await CommentModel.findByIdAndUpdate(
      commentId,
      { $set: { text } },
      { new: true }
    );
    const populatedComment = await CommentModel.findById(updated._id).populate(
      "user",
      "_id username avatar"
    );
    return res.status(200).json(populatedComment);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while editing comment",
      error: err.message,
    });
  }
}

export async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    //get comment id and find in comment model
    const exists = await CommentModel.findById(commentId);
    if (!exists)
      return res.status(404).json({ message: "Comment does not exist" });

    // Only owner can delete
    if (!exists.user.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });
    await CommentModel.findByIdAndDelete(commentId);
    //delete comment from comment model
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while deleting comment",
      error: err.message,
    });
  }
}

export async function likeComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    //get comment id and user id from req and find comment with commentId
    const comment = await CommentModel.findById(commentId).populate(
      "user",
      "_id username avatar"
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Toggle like
    if (comment.likes.some((like) => like.equals(userId))) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
      comment.dislikes.pull(userId); //remove dislike
    }

    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({
      message: "Error while liking comment",
      error: err.message,
    });
  }
}

export async function dislikeComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    //get comment id and user id from req and find comment with commentId
    const comment = await CommentModel.findById(commentId).populate(
      "user",
      "_id username avatar"
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Toggle dislike
    if (comment.dislikes.some((dislike) => dislike.equals(userId))) {
      comment.dislikes.pull(userId);
    } else {
      comment.dislikes.push(userId);
      comment.likes.pull(userId); //remove like
    }

    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({
      message: "Error while disliking comment",
      error: err.message,
    });
  }
}
