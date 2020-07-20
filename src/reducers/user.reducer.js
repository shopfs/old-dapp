import { userConstants } from "../constants";

export function user(state = {data: {}}, action) {
    switch (action.type) {
        case userConstants.STARTED:
            return {
                ...state,
                inProgress: true
            };
        case userConstants.DONE:
            return {
                ...state,
                inProgress: false
            };
        case userConstants.CLEAN:
            return {
                ...state,
                data: {},
                inProgress: false,
            };
        case userConstants.ERROR:
            return {
                role: state.role,
                inProgress: false,
                error: action.error,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case userConstants.CLEAN_SELECTED:
            return {
                ...state,
                ...action,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case userConstants.RESULT:
            return {
                ...state,
                inProgress: false,
                ...action,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        default:
            return state;
    }
}
