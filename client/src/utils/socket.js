import io from 'socket.io-client';
import { addMessage } from "../api/message.requests";
import { getMessages } from '../actions/message.actions';

// EN
// This is where all the socket functions are stored.
// I believe that calling these functions in the components is better than
// creating the functions inside the components.

// TR
// Burası, tüm soket fonksiyonlarının saklandığı yerdir.
// Bu fonksiyonları component'lerde oluşturmak yerine component'lerde çağırmak,
// bence daha iyi bir yaklaşımdır.

// EN
// VITE_APP_SERVER_URL is the environment variable that stores the server URL with the socket.

// TR
// VITE_APP_SERVER_URL, soketin calistigi server'in url'sini tutan env parametresidir.
const socket = io(import.meta.env.VITE_APP_SOCKET_URL);

const socketFunctions = {
  // EN
  // This function is used for connecting to the socket.
  // It takes the user who will be connecting to the socket
  // and the "setOnlineUsers" function returned by the useState hook 
  // to add the provided user to the array of online users.

  // TR
  // Bu fonksiyon, sokete bağlanmak için kullanılır.
  // Sokete bağlanacak kullanıcıyı ve cevrimiçi kullanıcılar dizisine,
  // verilen kullanıcıyı eklemek için useState hook'undan dönen "setOnlineUsers" fonksiyonunu alır.
  connectSocket: (user, setOnlineUsers) => {
    socket.emit("new-user-add", user?._id);
    socket.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    // EN
    // Add the user to make them online.

    // TR
    // Kullaniciyi cevrimici yapmak icin ekle.
    const handleFocus = () => {
      socket.emit("new-user-add", user?.id);
    };

    // EN
    // Remove user from online users, so they will be offline.

    // TR
    // Kullanici cevrimdisi olsun diye kullaniciyi cevrimici kullanicilardan cikar.
    const handleBlur = () => {
      if (user) {
        socket.emit("offline");
      }
    };

    // EN
    // Adding event listeners so the user will be offline when the website isn't on focus.

    // TR
    // Site acik olmadiginda kullanicinin cevrimdisi olmasi icin event listener ekliyoruz.
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      // EN
      // Remove the event listeners when component unmounts

      // TR
      //
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  },

  // EN
  // This function is for sending a message.
  // The parameter 'message' is an object which includes these variables,
  // senderId, text, chatId, status, receiverId, createdAt

  // TR
  // Bu fonksiyon mesaj gondermek icindir.
  // 'message' parametresi icinde su degiskenleri tutan bir objedir,
  // senderId, text, chatId, status, receiverId, createdAt
  sendMessage: (message) => {
    if (message) {
      socket.emit("send-message", message);
    }
  },

  // EN
  // This function listens for incoming messages and updates the received message state if the chatId matches.

  // TR
  // Bu fonksiyon gelen mesajları dinler ve chatId uyusuyorsa alınan mesaj durumunu günceller.
  receiveMessage: (setReceivedMessage, chatId) => {
    socket.on("recieve-message", (data) => {
      if (data.chatId === chatId) {
        setReceivedMessage(data);
      }
    });
  },

  // EN
  // This function listens for incoming file uploads and updates the received message state if the chatId matches.

  // TR
  // Bu fonksiyon gelen dosya yüklemelerini dinler ve chatId uyusuyorsa alınan mesaj durumunu günceller.
  receiveUpload: (setReceivedMessage, chatId) => {
    socket.on("receive-upload", (data) => {
      if (data.chatId === chatId) {
        setReceivedMessage(data);
      }
    });
  },

  // EN
  // This function emits a "typing" event when the user starts typing a message.

  // TR
  // Bu fonksiyon, kullanıcı bir mesaj yazmaya başladığında "typing" olayını gönderir.
  sendTyping: (user, chat, currentUser) => {
    const receiver = chat.members.find((id) => id !== currentUser);
    socket.emit("typing", {
      // EN
      // 'typer' variable is for displaying a message like "John typing..."

      // TR
      // 'typer' degiskeni "John yaziyor..." gibi bir mesaj goruntilemek icindir.
      typer: user.firstname,
      receiverId: receiver,
    });
  },

  // EN
  // This function fetches a chats' messages.
  // It'll also mark the last message as 'seen' if it's from the other user.

  // TR
  // Bu fonksiyon, bir konusmanin mesajlarini getirir.
  // Ayrica son mesaj oteki kullanicininsa mesaji 'goruldu' olarak isaretler.
  fetchMessages: async (user, chat, setMessages, currentUser, dispatch) => {
    try {
      if(chat) {
        // EN
        // Fetch messages for the current chat and update the messages state.

        // TR
        // 
        const data = await dispatch(getMessages(chat._id));
        setMessages(data);

        // EN
        // Mark the last message as seen if it's from another user
        var lastMessage = data[data.length - 1];
        if (lastMessage?.senderId !== currentUser) {
            socket.emit("message-seen-status", {
            chatId: chat._id,
            userId: user._id,
            status: "",
            });        
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  // EN
  // Function to fetch typing status and update the UI accordingly.
  // It listens for "get-typing" event and displays the typing status.
  // Clears the typing status after 2 seconds.

  // TR
  // Yazıyor durumunu getirir ve arayüzü buna göre günceller.
  // "get-typing" olayını dinler ve yazıyor durumunu görüntüler.
  // Yazıyor durumunu 2 saniye sonra temizler.
  fetchTyping: (setTyping) => {
    socket.on("get-typing", (data) => {
      setTyping(data.typer + " is typing..");

      // Clear the typing status after 2 seconds
      setTimeout(() => {
        setTyping("");
      }, 2000);
    });
  },

  // EN
  // Function to receive a message from the chat parent.
  // Updates the message list and emits "message-seen-status".

  // TR
  // Mesajları ebeveyn sohbetinden almak için fonksiyon.
  // Mesaj listesini günceller ve "message-seen-status" olayını emit'ler.
  receiveMessageFromParent: (receivedMessage, chat, setMessages, currentUser, messages) => {
    console.log("Message Arrived: ", receivedMessage);
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);

      socket.emit("message-seen-status", receivedMessage);
    }
  },

  // EN
  // Function to handle file selection in chats.
  // Sets the selected file and emits "upload" event to send the file.
  // Updates the message list with the new file message.

  // TR
  // Sohbetlerde dosya seçimini işlemek için fonksiyon.
  // Seçilen dosyayı ayarlar ve dosyayı göndermek için "upload" olayını emit'ler.
  // Yeni dosya mesajıyla mesaj listesini günceller.
  handleFileSelect: async (event, chat, setSelectedFile, setMessages, currentUser, setNewMessage, messages) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const receiverId = chat.members.find((id) => id !== currentUser);
    socket.emit("upload", {
      file,
      receiverId,
      chatId: chat._id,
      createdAt: new Date(),
    });

    try {
      const { data } = await addMessage({
        chatId: chat._id,
        senderId: currentUser,
        file: file,
      });
      setMessages([...messages, { ...data, createdAt: new Date() }]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  },

  callUser: async (event, chat, setSelectedFile, setMessages, currentUser, setNewMessage, messages) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const receiverId = chat.members.find((id) => id !== currentUser);
		socket.on("call-user", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setCallerSignal(data.signal);
		})

    try {
      const { data } = await addMessage({
        chatId: chat._id,
        senderId: currentUser,
        file: file,
      });
      setMessages([...messages, { ...data, createdAt: new Date() }]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  },
};

export default socketFunctions;
