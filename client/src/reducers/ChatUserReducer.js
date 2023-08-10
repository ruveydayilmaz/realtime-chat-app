
const initialState = {
    chatUsers: [],
    loading: false,
    error: false
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_USER":
            return ({ ...state, chatUsers: [...state.chatUsers, action.data] });
        default:
            return state
    }
};

export default chatReducer