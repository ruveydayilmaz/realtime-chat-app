import MessageModel from "../models/message.model.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
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

export const updateMessageStatus = async (id, status) => {
  try {
    if(status === "seen") {
      const lastMessage = await MessageModel.find({chatId: id}).limit(1).sort({ $natural : -1 });

      await MessageModel.updateOne(  // bu da updateMany olabilir içine de status: "delivered" yazılabilir
        { _id: lastMessage[0]._id },
        {
          $set: {
            status: status,
          },
        }
      );
    }
    else if(status === "delivered") {
      await MessageModel.updateMany( 
        { 
          userId: id,
          status: "sent"
        },
        {
          $set: {
            status: status,
          },
        }
      );
    }

  } catch (error) {
    console.log(error.message);
  }
};
