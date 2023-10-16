// UTILS / HELPERS / SERVICES
const APIError = require('../services/error.js');
const apiResponse = require('../utils/apiResponse.js');

// MODELS
const Message = require("../models/message.js");
const Chat = require("../models/chat.js");

const messageController = {};

messageController.sendMessage = async (req, res, next) => {
  try {
    const data = {
      chatId: req.body.chatId,
      senderId: req.payload._id,
      text: req.body.text,
      file: req.file?.buffer,
    };

    const filter = {_id: data.chatId};
    const chat = await Chat.findOne(filter);
    if (!chat) return apiResponse.notFoundResponse(res, req.t("NotFound", { model: "chat"}));

    const createdMessage = await Message.create(data);

    const responseData = {
      createdMessage
    };

    return apiResponse.successResponse(res, req.t("SuccessfullyCreated", {model: "message"}), responseData);
  } catch (error) {
    console.log(error)
    next(new APIError(null, apiResponse.API_STATUS.SERVER_ERROR, error));
  }
};

messageController.getMessages = async (req, res, next) => {
  try {
    const data = {
      chatId: req.params.id,
    };

    const filter = {chatId: data.chatId};
    const messages = await req.PaginationProcess(Message, filter);

    const responseData = {
      messages
    };

    return apiResponse.successResponse(res, req.t("SuccessfullyFetched", {model: "messages"}), responseData);
  } catch (error) {
    console.log(error)
    next(new APIError(null, apiResponse.API_STATUS.SERVER_ERROR, error));
  }
};

messageController.updateMessageStatus = async ({ chatId, userId, status }) => {
  try {
    if (status === "seen") {
      const lastMessage = await Message.find({
        chatId: chatId,
        senderId: { $ne: userId },
      })
        .limit(1)
        .sort({ $natural: -1 });

        if(lastMessage.length > 0) {
          await Message.updateOne(
            // bu da updateMany olabilir içine de status: "delivered" yazılabilir
            { _id: lastMessage[0]._id },
            {
              $set: {
                status: status,
              },
            }
          );          
        }

      } else if (status === "delivered") {
        const chats = await Chat.find({ members: userId });

        const chatIDs = chats.map((chat) => {
          return chat._id;
        });

        await Message.updateMany(
          {
            chatId: { $in: chatIDs },
            senderId: { $ne: userId },
            status: "sent",
          },
          {
            status: status,
          }
        );
      }
      
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = messageController;