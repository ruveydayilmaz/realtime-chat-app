import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";

export const createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });

    var chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        chat = chat.toJSON();

        const notSeenCount = await MessageModel.count({
          chatId: chat._id,
          senderId: { $ne: req.params.userId },
          status: { $ne: "seen" },
        });
        
        const lastMessage = await MessageModel.findOne({
          chatId: chat._id,
        }).sort({ createdAt: -1 });
        return {
          ...chat,
          lastMessage,
          notSeenCount,
        };
      })
    );

    res.status(200).json(chatsWithLastMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
