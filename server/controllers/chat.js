// UTILS / HELPERS / SERVICES
const APIError = require('../services/error.js');
const apiResponse = require('../utils/apiResponse.js');

// MODELS
const Chat = require("../models/chat.js");
const Message = require("../models/message.js");

const chatController = {};

chatController.createChat = async (req, res) => {
  try {
    const data = {
      member1: req.body.member,
      member2: req.payload._id,
    };

    const filter = {$or: {members: [data.member1, data.member2], members: [data.member2, data.member1]}};
    const chat = await Chat.findOne(filter);
    if (chat) return apiResponse.notFoundResponse(res, req.t("AlreadyExists", { model: "chat"}));

    const createdChat = await Chat.create({members: [data.member1, data.member2]});

    const responseData = {
      createdChat
    };

    return apiResponse.successResponse(res, req.t("SuccessfullyCreated", {model: "chat"}), responseData);
  } catch (error) {
    console.log(error)
    next(new APIError(null, apiResponse.API_STATUS.SERVER_ERROR, error));
  }
};

chatController.getUserChats = async (req, res) => {
  try {
    const data = {
      _id: req.payload._id,
    };

    const chats = await Chat.find({
      members: { $in: [data._id] },
    });

    var chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        chat = chat.toJSON();

        const notSeenCount = await Message.count({
          chatId: chat._id,
          senderId: { $ne: data._id },
          status: { $ne: "seen" },
        });
        
        const lastMessage = await Message.findOne({
          chatId: chat._id,
        }).sort({ createdAt: -1 });

        return {
          ...chat,
          lastMessage,
          notSeenCount,
        };
      })
    );

    const responseData = {
      chatsWithLastMessage
    };

    return apiResponse.successResponse(res, req.t("SuccessfullyFetched", {model: "chat"}), responseData);
  } catch (error) {
    console.log(error)
    next(new APIError(null, apiResponse.API_STATUS.SERVER_ERROR, error));
  }
};

chatController.findChat = async (req, res) => {
  try {
    const data = {
      member1: req.params.member,
      member2: req.payload._id,
    };

    const chat = await Chat.findOne({
      members: { $all: [data.member1, data.member2] },
    });

    const responseData = {
      chat
    };

    return apiResponse.successResponse(res, req.t("SuccessfullyFetched", {model: "chat"}), responseData);
  } catch (error) {
    console.log(error)
    next(new APIError(null, apiResponse.API_STATUS.SERVER_ERROR, error));
  }
};

module.exports = chatController;