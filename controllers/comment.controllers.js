import CommentModel from "../models/Comment.model.js";

export async function getComments(req,res) {
   try {
    const { id: videoId } = req.params;

    const comments = await CommentModel.find({ video: videoId })
      .populate("user", "username fullName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while fetching comments",
      error: err.message
    });
  }
}

export async function addComment(req,res) {
    try {
    const { id: videoId } = req.params;
    const { text } = req.body;

    if (!text)
      return res.status(400).json({ message: "Comment text is required" });

    const newComment = await CommentModel.create({
      video: videoId,
      user: req.user._id,
      text
    });

    return res.status(201).json(newComment);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while adding comment",
      error: err.message
    });
  }
}

export async function editComment(req,res) {
      try {
    const { commentId } = req.params;
    const { text } = req.body;

    const exists = await CommentModel.findById(commentId);
    if (!exists)
      return res.status(404).json({ message: "Comment does not exist" });

    // Only owner can edit
    if (exists.user.toString() !== req.user._id)
      return res.status(403).json({ message: "Unauthorized" });

    const updated = await CommentModel.findByIdAndUpdate(
      commentId,
      { $set: { text } },
      { new: true }
    );

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while editing comment",
      error: err.message
    });
  }
}

export async function deleteComment(req,res) {
   try {
    const { commentId } = req.params;

    const exists = await CommentModel.findById(commentId);
    if (!exists)
      return res.status(404).json({ message: "Comment does not exist" });

    // Only owner can delete
    if (exists.user.toString() !== req.user._id)
      return res.status(403).json({ message: "Unauthorized" });

    await CommentModel.findByIdAndDelete(commentId);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while deleting comment",
      error: err.message
    });
  }
}

export async function likeComment(req,res) {
     try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await CommentModel.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    // Remove dislike if exists
    comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);

    // Toggle like
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({
      message: "Error while liking comment",
      error: err.message
    });
  }
}

export async function dislikeComment(req,res) {
   try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await CommentModel.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    // Remove like if exists
    comment.likes = comment.likes.filter(id => id.toString() !== userId);

    // Toggle dislike
    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId);
    } else {
      comment.dislikes.push(userId);
    }

    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({
      message: "Error while disliking comment",
      error: err.message
    });
  }
}