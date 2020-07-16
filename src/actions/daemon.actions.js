import { SpaceClient } from "@fleekhq/space-client";
import { alertActions } from "./";
import { daemonConstants } from "../constants";

export const daemonActions = {
    clean
};

const daemon = new SpaceClient({url: `http://0.0.0.0:9998`});

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
