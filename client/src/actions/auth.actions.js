import * as api from "../api/auth.requests";

export const logIn = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await api.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("../", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const signUp = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("../", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};

export const logout = ()=> async(dispatch)=> {
  dispatch({type: "LOG_OUT"})
}