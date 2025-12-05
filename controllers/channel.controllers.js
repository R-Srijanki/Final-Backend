import Channel from "../models/Channel.model.js"
import Video from "../models/Video.model.js";
import User from "../models/User.model.js";
import Comment from "../models/Comment.model.js";
export async function createChannel(req,res) {
    try {
    const { name, handle} = req.body;//get details from req body
    if (!name || !handle)
      return res.status(400).json({ message: "Missing required fields" });

    // A user must not create more than one channel
    const existing = await Channel.findOne({ owner: req.user._id });
    if (existing)
      return res.status(400).json({ message: "Channel already exists for this user" });
//create avatar from name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    //convert req.file to string as it is stored in string format
   const bannerBase64 = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : "";
    const newChannel = await Channel.create({
      name,
      handle,
      avatar: avatarUrl,
      channelBanner:bannerBase64,
      owner: req.user._id
    });
    //create channel with details and update in user
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
//get channel with id
        const channel = await Channel.findById(id)
        .populate("owner", "name email")
        .populate("subscribers", "_id name")
        .populate("videos", "_id title thumbnailUrl views uploadDate");

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
//find channel by id 
        const channel = await Channel.findById(id);
        if (!channel)
        return res.status(404).json({ message: "Channel not found" });

        if (channel.owner.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Unauthorized" });
      //update based on fields sent by req.body
        const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.handle) updates.handle = req.body.handle;
    if (req.body.description) updates.description = req.body.description;

    if (req.file) {
      // req.file.buffer contains file data
      // Save to cloud or disk and set URL
      updates.channelBanner = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : "";
    }
//update channel
    const updatedChannel = await Channel.findByIdAndUpdate(id, updates, { new: true });
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
//find channel by id
        const channel = await Channel.findById(id);
        if (!channel)
            return res.status(404).json({ message: "Channel not found" });

        if (channel.owner.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Unauthorized" });
//find all videos with channel id
        const videos = await Video.find({ channel: id });

        const videoIds = videos.map(v => v._id);
//delete comments,videos and channel 
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
//find channel by id 
    const channel = await Channel.findById(id);
    if (!channel)
      return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot subscribe to your own channel" });
    }
    //toggle subscribe
    if (channel.subscribers.includes(req.user._id)) {
      channel.subscribers.pull(req.user._id);
    } else {
      channel.subscribers.push(req.user._id);
    }

    await channel.save();

    return res.status(200).json(channel);
  } 
  catch (err) {
    return res.status(500).json({
      message: "Error subscribing to channel",
      error: err.message
    });
  }
}
