import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import chatReducer from "./ChatUserReducer";

export const reducers = combineReducers({authReducer, chatReducer})