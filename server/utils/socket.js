const { updateMessageStatus } = require("../controllers/message.js");

const socket = (server) => {
    let activeUsers = []; // <- This is definetly not how it's done in a real-life project.
    // Storing all the users in a single array isn't efficient.
    // I tried to find a better way to do this, but couldn't find a real-life example.
    // I'll update this cocde if i can find the correct solution.

    const io = require("socket.io")(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            maxHttpBufferSize: 1e8,
        },
    });

    io.on("connection", (socket) => {
        // Add new User
        socket.on("new-user-add", (newUserId) => {
            // If user is not added previously, add it to the activeUsers array
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({ userId: newUserId, socketId: socket.id });
                // console.log("New User Connected", activeUsers);
                updateMessageStatus({
                    userId: newUserId,
                    status: "delivered",
                });
            }
            // Send all active users to all users
            io.emit("get-users", activeUsers);
        });

        socket.on("disconnect", () => {
            // Remove user from active users
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            // console.log("User Disconnected", activeUsers);
            // Send all active users to all users
            io.emit("get-users", activeUsers);
        });

        socket.on("offline", () => {
            // remove user from active users
            // activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            // console.log("User Disconnected", activeUsers);
            // send all active users to all users
            io.emit("get-users", activeUsers);
        });

        // typing status
        socket.on("typing", (data) => {
            const user = activeUsers.find((user) => user.userId === data.receiverId);
            if (user) {
                io.to(user.socketId).emit("get-typing", data);
                // console.log("typing: " + data)
            }
        });

        // send message to a specific user
        socket.on("send-message", (data) => {
            const { receiverId } = data;
            const user = activeUsers.find((user) => user.userId === receiverId);
            // console.log("Sending from socket to :", receiverId)
            data.status = "sent";
            // console.log("Data: ", data)
            if (user) {
                console.log('user id bu', user)
                io.to(user.socketId).emit("recieve-message", data);
            }

            // console.log("--------------------");
        });

        socket.on("message-seen-status", (data) => {
            // console.log("-------SEEN-------")
            data.status = "seen";
            updateMessageStatus({
                chatId: data.chatId,
                userId: data.userId,
                status: data.status,
            });
            // console.log("Message seen by: ", data)
            io.emit("message-seen", data);
        });

        socket.on("upload", (data) => {
            const user = activeUsers.find((user) => user.userId === data.receiverId);
            // io.to(user.socketId).emit("receive-upload", file);

            if (user) {
                io.to(user.socketId).emit("receive-upload", data);
            }
        });

        socket.on('call-user', (data) => {
            console.log('coming call', data)
            const user = activeUsers.find((user) => user.userId === data.userToCall._id);

            if (user) {
                // join a room for both callReceiver and callSender
                io.to(user.socketId).emit('receive-call', data);
            }
        });

        // socket.on('leave-voice', (data) => {
        //   const user = activeUsers.find((user) => user.userId === data.userId);

        //   if (user) {
        //     io.to(room).emit('remove-from-voice', { id: socket.id, user });
        //     removeUserFromVoice(socket.id);
        //   }
        // });

    });
}

module.exports = socket;