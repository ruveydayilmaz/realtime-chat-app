
const initialState = {
    loading: false,
    error: false
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOADING_START":
            return ({ ...state, loading: true });
        case "LOADING_DONE":
            return ({ ...state, loading: false });
        default:
            return state
    }
};

export default chatReducer