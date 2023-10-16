import * as api from "../api/message.requests";

export const getMessages = (chatId) => async (dispatch) => {
  dispatch({ type: "LOADING_START" });
  try {
    const { data } = await api.getMessages(chatId);
    dispatch({ type: "LOADING_DONE", data: data });
    
    if(data.success === true) {
      return data.data[0].messages;
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