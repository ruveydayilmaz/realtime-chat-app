import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import chatReducer from "./ChatUserReducer";
import mutualReducer from "./MutualReducer";

export const reducers = combineReducers({authReducer, chatReducer, mutualReducer})