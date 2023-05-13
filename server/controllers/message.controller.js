import MessageModel from "../models/message.model.js";
import ChatModel from "../models/chat.model.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  if (req.file) var file = req.file.buffer;

  const message = new MessageModel({
    chatId,
    senderId,
    text,
    file: file,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateMessageStatus = async ({ chatId, userId, status }) => {
  try {
    if (status === "seen") {
      const lastMessage = await MessageModel.find({
        chatId: chatId,
        senderId: { $ne: userId },
      })
        .limit(1)
        .sort({ $natural: -1 });

        if(lastMessage.length > 0) {
          await MessageModel.updateOne(
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
        const chats = await ChatModel.find({ members: userId });

        const chatIDs = chats.map((chat) => {
          return chat._id;
        });

        await MessageModel.updateMany(
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
