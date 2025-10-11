import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import mongoose from "mongoose";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

    res.status(200).json(filteredUsers);
}catch (error) {
    console.error('Error fetching users for sidebar:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const {id:userToChatId} = req.params;
    const senderId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderid: senderId, receiverid: userToChatId },
        { senderid: userToChatId, receiverid: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const {text,image} = req.body;
    const {id:receiverid} = req.params;
    const senderid = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(senderid)) {
      return res.status(400).json({ message: "Invalid sender ID" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; 
    }
    const newMessage = new Message({
      senderid,
      receiverid,
      text,
      image: imageUrl
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error); 
    res.status(500).json({ message: 'Server error' });
  }
};