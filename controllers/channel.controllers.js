import Channel from "../models/Channel.model.js"
export async function createChannel(req,res) {
    try {
    const { name, handle, description, channelBanner } = req.body;

    // A user must not create more than one channel
    const existing = await Channel.findOne({ owner: req.user._id });
    if (existing)
      return res.status(400).json({ message: "Channel already exists for this user" });

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const newChannel = await Channel.create({
      name,
      handle,
      description,
      avatar: avatarUrl,
      channelBanner,
      owner: req.user._id
    });

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

        await Channel.findByIdAndDelete(id);

        return res.status(200).json({
        message: "Channel deleted successfully"
        });

    }
    catch (err) {
        return res.status(500).json({
            message: "Error deleting channel",
            error: err.message
        });
    }
}