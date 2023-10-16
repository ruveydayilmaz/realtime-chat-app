import React from "react";
import { Buffer } from "buffer";

const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Today";
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return date.toLocaleDateString("EN", { weekday: "long" });
    } else {
        return date.toLocaleDateString();
    }
};

const isSameDay = (date1, date2) => {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    return (
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    );
};

const functions = {
    renderMessage: (message, index, messages, currentUser) => {
        if (message) {
            const previousMessage = messages[index - 1];

            const showDate =
                !previousMessage ||
                !isSameDay(message.createdAt, previousMessage?.createdAt);
            let messageElement;

            if (message?.file) {
                const imageSrc = `data:image/jpeg;base64,${Buffer.from(
                    message.file
                ).toString("base64")}`;
                messageElement = (
                    <React.Fragment key={index}>
                        <div
                            className={
                                message.senderId === currentUser ? "message own" : "message"
                            }
                        >
                            <img src={imageSrc} alt="received image" />
                        </div>
                        <div
                            className={
                                message.senderId === currentUser ? "time time-own" : "time"
                            }
                        ></div>
                    </React.Fragment>
                );
            } else if (message?.chatId && !message?.file) {
                messageElement = (
                    <React.Fragment key={index}>
                        <div
                            className={
                                message.senderId === currentUser ? "message own" : "message"
                            }
                        >
                            <span>{message.text}</span>
                        </div>
                        <div
                            className={
                                message.senderId === currentUser ? "time time-own" : "time"
                            }
                        ></div>
                    </React.Fragment>
                );
            } else if (message.type === "img") {
                console.log("IMAGE", message);
                messageElement = (
                    <React.Fragment key={index}>
                        <div
                            className={
                                message.senderId === currentUser ? "message own" : "message"
                            }
                        >
                            <img src={message.props.src} alt="received image" />
                        </div>
                        <div
                            className={
                                message.senderId === currentUser ? "time time-own" : "time"
                            }
                        ></div>
                    </React.Fragment>
                );
            } else {
                console.log("Unknown message type:", message.type);
                messageElement = <p>Unknown message type</p>;
            }

            if (showDate) {
                return (
                    <React.Fragment key={index}>
                        <div className="message-date">{formatDate(message.createdAt)}</div>
                        {messageElement}
                    </React.Fragment>
                );
            } else {
                return messageElement;
            }
        }
    }
}

export default functions;