import { daemonConstants } from "../constants";

const initialState = {
    inProgress: false,
    data: {}
};
export function daemon(state = initialState, action) {
    switch (action.type) {
        case daemonConstants.STARTED:
            return {
                ...state,
                inProgress: true
            };
        case daemonConstants.LOADED:
            return {
                ...state,
                inProgress: false,
                ...action,
                data: {
                    ...state.data,
                    ...action.data
                }
            };
        case daemonConstants.CLEAN:
            return {
                ...state,
                inProgress: false,
                data: {}
            };
        case daemonConstants.ERROR:
            return {
                ...state,
                inProgress: false,
                error: action.error
            };
        default:
            return state;
    }
}
