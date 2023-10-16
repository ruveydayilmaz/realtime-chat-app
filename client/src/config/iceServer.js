export const iceServerConfig = () => {
  return {
    config: {
      iceServers: [
        {
          url: "turn:turn.anyfirewall.com:443?transport=tcp",
          credential: "webrtc",
          username: "webrtc",
        },
      ],
    },
  };
};
