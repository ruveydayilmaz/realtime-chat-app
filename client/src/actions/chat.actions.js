import * as api from "../api/chat.requests";

export const fetchUserChats = () => async (dispatch) => {
  dispatch({ type: "CHAT_LOADING_START" });
  try {
    const { data } = await api.fetchUserChats();
    dispatch({ type: "CHAT_LOADING_DONE", data: data });
    
    if(data.success === true) {
      dispatch({ type: "FETCH_CHATS", data: data.data[0].chatsWithLastMessage });
    } else {
      dispatch({ type: "ERROR", message: data.message });
    }
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const addMessage = (formData) => async (dispatch) => {
  try {
    const { data } = await api.addMessage(formData);
    
    if(data.success === true) {
      return data.data[0].createdMessage;
    } else {
      dispatch({ type: "ERROR", message: data.message });
    }
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};