import db from "../models/index.js";

const { MentorshipRequest, Notification, User } = db;

// Send Mentorship Request
export const sendRequest = async (req, res) => {
  const { receiverId } = req.body;

  try {
    // Check if a mentorship request already exists between the sender and receiver
    const existingRequest = await MentorshipRequest.findOne({
      where: {
        senderId: req.user.id,
        receiverId,
      },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "A request has already been sent to this user." });
    }

    // Create a new mentorship request if no duplicate exists
    const request = await MentorshipRequest.create({
      senderId: req.user.id,
      receiverId,
      status: "pending",
    });

    const sender = await User.findByPk(req.user.id, { attributes: ["name"] });
    const receiver = await User.findByPk(receiverId, { attributes: ["name"] });

    await Notification.create({
      userId: receiverId,
      message: `${sender.name} has sent you a request.`,
    });

    res.status(201).json(request);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "A request has already been sent to this user." });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to send request." });
  }
};

export const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch Received Requests
    const receivedRequests = await MentorshipRequest.findAll({
      where: { receiverId: userId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "role", "skills", "interests"],
        },
      ],
      attributes: ["id", "status", "createdAt"], // Include the status field
    });

    // Fetch Sent Requests
    const sentRequests = await MentorshipRequest.findAll({
      where: { senderId: userId },
      include: [
        {
          model: User,
          as: "receiver",
          attributes: ["id", "name", "role", "skills", "interests"],
        },
      ],
      attributes: ["id", "status", "createdAt"], // Include the status field
    });

    res.status(200).json({
      receivedRequests,
      sentRequests,
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch connection requests." });
  }
};

// Update Mentorship Request Status
export const updateRequestStatus = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL params
  const { status } = req.body; // Get the new status from the request body

  try {
    // Find the mentorship request by its primary key (id)
    const request = await MentorshipRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    const sender = await User.findByPk(request.senderId, {
      attributes: ["name", "id"],
    });
    const receiver = await User.findByPk(request.receiverId, {
      attributes: ["name", "id"],
    });

    //pahle he notification bhej do kyuki destroy hua to id khatam....

    await Notification.create({
      userId: sender.id,
      message: `${receiver.name} has ${status} your request.`,
    });

    // If the status is 'rejected', delete the request
    if (status.toLowerCase() === "rejected") {
      await request.destroy(); // Delete the record

      return res.json({
        message: "Request was rejected and deleted successfully.",
      });
    }

    // Otherwise, update the status of the request
    await request.update({ status });

    res.json({ message: "Request status updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update request status." });
  }
};
