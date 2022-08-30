import { GLOBALTYPES } from "../actions/globalTypes"

const initialState = {}

const modelReducer = (state = initialState, action) => {
    switch (action.type)
    {
        case GLOBALTYPES.MODEL:
            return action.payload;
        default:
            return state;
    }
}

export default modelReducer