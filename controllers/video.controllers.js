import Video from "../models/Video.model.js"
import Channel from "../models/Channel.model.js"
export async function getVideos(req,res){
   try {
    const videos = await Video.find({})
      .populate("uploader", "username fullName avatar")
      .populate("channelId", "name handle avatar");

    return res.status(200).json(videos);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while fetching videos",
      error: err.message,
    });
  }
}

export async function getVideo(req,res) {
    try {
    const { id } = req.params;

    const video = await Video.findById(id)
      .populate("uploader", "username fullName avatar")
      .populate("channelId", "name handle avatar");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json(video);
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while fetching video",
      error: err.message,
    });
  }

}

export async function uploadVideo(req,res) {
    try {
    const { title, thumbnailurl, videoUrl, description, category, channel } =
      req.body;

    if (!title || !thumbnailurl || !videoUrl || !description || !channel) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // uploader is the logged-in user
    const uploaderId = req.user.id;

    const newVideo = await Video.create({
      title,
      thumbnailurl,
      videoUrl,
      description,
      category,
      uploader: uploaderId,
      channel,
      views: 0,
    });

    // Add video to channel’s video list
    await Channel.findByIdAndUpdate(channel, {
      $push: { videos: newVideo._id },
    });

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred during uploading video",
      error: err.message,
    });
  }
}

export async function updateVideo(req,res) {
  try {
    const { id } = req.params;

    const updatedVideo = await Video.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred during updating video",
      error: err.message,
    });
  }

}

export async function deleteVideo(req,res) {
   try {
    const { id } = req.params;

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Remove from channel
    await Channel.findByIdAndUpdate(deletedVideo.channel, {
      $pull: { videos: id },
    });

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error occurred while deleting video",
      error: err.message,
    });
  }
}

export async function likeVideo(req,res) {
    try {
    const userId = req.user.id;
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // If user already liked, remove like (toggle)
    if (video.likes.includes(userId)) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      // remove dislike if exists
      video.dislikes.pull(userId);
    }

    await video.save();

    return res.status(200).json({
      message: "Video like updated",
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while liking video",
      error: err.message,
    });
  }
}

export async function dislikeVideo(req,res) {
    try {
    const userId = req.user.id;
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Toggle dislike
    if (video.dislikes.includes(userId)) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }

    await video.save();

    return res.status(200).json({
      message: "Video dislike updated",
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while disliking video",
      error: err.message,
    });
  }
}
