import Channel from "../models/Channel.model.js"
import Video from "../models/Video.model.js";
export async function createChannel(req,res) {
    try {
    const { name, handle} = req.body;
    if (!name || !handle)
      return res.status(400).json({ message: "Missing required fields" });

    // A user must not create more than one channel
    const existing = await Channel.findOne({ owner: req.user._id });
    if (existing)
      return res.status(400).json({ message: "Channel already exists for this user" });

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    const bannerPath = req.file ? `/uploads/${req.file.filename}` : "";
    const newChannel = await Channel.create({
      name,
      handle,
      avatar: avatarUrl,
      channelBanner:bannerPath,
      owner: req.user._id
    });
    await User.findByIdAndUpdate(req.user._id, { channel: newChannel._id });
    return res.status(201).json({
      message: "Channel created successfully",
      data: newChannel
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error creating channel",
      error: err.message
    });
  }
}
export async function getChannel(req,res) {
    try{
        const { id } = req.params;

        const channel = await Channel.findById(id)
        .populate("owner", "name email")
        .populate("subscribers", "_id name")
        .populate("videos", "title thumbnail views");

        if (!channel)
        return res.status(404).json({ message: "Channel not found" });

        return res.status(200).json({
        message: "Channel details",
        data: channel
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Error fetching channel",
            error: err.message
        });
    }
}
export async function editChannel(req,res) {
    try{
        const { id } = req.params;

        const channel = await Channel.findById(id);
        if (!channel)
        return res.status(404).json({ message: "Channel not found" });

        if (channel.owner.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Unauthorized" });

        const updates = req.body;

        const updatedChannel = await Channel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
        );

        return res.status(200).json({
        message: "Channel updated successfully",
        data: updatedChannel
        });

    }
    catch (err) {
        return res.status(500).json({
            message: "Error updating channel",
            error: err.message
        });
  }
}
export async function deleteChannel(req,res) {
    try{
       const { id } = req.params;

        const channel = await Channel.findById(id);
        if (!channel)
            return res.status(404).json({ message: "Channel not found" });

        if (channel.owner.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Unauthorized" });

        const videos = await Video.find({ channel: id });

        const videoIds = videos.map(v => v._id);

        await Comment.deleteMany({ video: { $in: videoIds } });

        await Video.deleteMany({ channel: id });

        await Channel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Channel deleted successfully with all linked videos and comments"
        });

    }
    catch (err) {
        return res.status(500).json({
            message: "Error deleting channel",
            error: err.message
        });
    }
}

export async function subscribeChannel(req, res) {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id);
    if (!channel)
      return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot subscribe to your own channel" });
    }

    if (channel.subscribers.includes(req.user._id)) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    channel.subscribers.push(req.user._id);
    await channel.save();

    return res.status(200).json({
      message: "Subscribed successfully",
      channelId: id
    });

  } 
  catch (err) {
    return res.status(500).json({
      message: "Error subscribing to channel",
      error: err.message
    });
  }
}

export async function unsubscribeChannel(req, res) {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id);
    if (!channel)
      return res.status(404).json({ message: "Channel not found" });

    const isSubscribed = channel.subscribers.includes(req.user._id);

    if (!isSubscribed)
      return res.status(400).json({ message: "You are not subscribed" });

    channel.subscribers = channel.subscribers.filter(
      (sub) => sub.toString() !== req.user._id.toString()
    );

    await channel.save();

    return res.status(200).json({
      message: "Unsubscribed successfully",
      channelId: id
    });

  } 
  catch (err) {
    return res.status(500).json({
      message: "Error unsubscribing",
      error: err.message
    });
  }
}