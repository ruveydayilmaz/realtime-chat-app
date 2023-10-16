
const functions = {
    handleMouseMove: (event, setNavWidth, isResizing, prevMouseX, setPrevMouseX) => {
        if (isResizing) {
            const delta = event.clientX - prevMouseX;
            setPrevMouseX(event.clientX);
            window.requestAnimationFrame(() => {
                setNavWidth((prevWidth) => {
                    const newWidth = prevWidth + delta;
                    if (newWidth >= 200 && newWidth < 400) {
                        return newWidth;
                    } else if (newWidth < 200) {
                        return 200;
                    } else {
                        return 380;
                    }
                });
            });
        }
    },

    handleMouseUp: (setIsResizing) => {
        setIsResizing(false);
    },

    handleMouseDown: (event, navRef, setIsResizing, setPrevMouseX) => {
        const rightEdge = navRef.current.getBoundingClientRect().right;
        if (event.clientX > rightEdge - 10) {
            setIsResizing(true);
            setPrevMouseX(event.clientX);
        }
    },

    checkOnlineStatus: (chat, onlineUsers, user) => {
        const chatMember = chat.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    }
}

export default functions;