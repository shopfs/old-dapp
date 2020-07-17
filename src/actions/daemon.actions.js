import { alertActions } from "./";
import { daemonConstants } from "../constants";

export const daemonActions = {
};

function clean() {
    return dispatch => {
        dispatch({
            type: daemonConstants.CLEAN
        });
    };
}

function started() {
    return {
        type: daemonConstants.STARTED
    };
}

function loaded(daemon) {
    return {
        type: daemonConstants.LOADED,
        ...daemon
    };
}

function failure(error) {
    return {
        type: daemonConstants.ERROR,
        error
    };
}
