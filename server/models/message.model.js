import mongoose from "mongoose"

 const MessageSchema = mongoose.Schema({
    chatId: {
        type: String
    },
    senderId: {
        type: String
    },
    text: {
        type: String
    },
    file: {
        type: Buffer
    },
    status: {
        type: String,
        default: "sent",
        enum: ["sent", "delivered", "seen"]
    }
 },
 {
    timestamps: true
 });

 const MessageModel = mongoose.model("Message", MessageSchema)
 export default MessageModel