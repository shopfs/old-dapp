import { SpaceClient } from "@fleekhq/space-client";
import { alertActions } from "./";
import { daemonConstants } from "../constants";

export const daemonActions = {
    loadDaemon,
    clean
};

function loaddaemon(account) {
    return async (dispatch, getState) => {
        dispatch(started());
        let daemon;
        try {
            const daemon = await Box.openBox(account, window.ethereum);
            console.log(daemon);
            //authenticate users's space for ipfsethmarketplace app
            //for new user it will create ipfsethmarketplace space
            //for exissting user it will access his ipfsethmarketplace space
            space = await daemon.openSpace(daemonConstants.SPACE_NAME);
            console.log(space);
            //wait till user's data is synced from network
            await daemon.syncDone;
            window.daemon = daemon;
            await space.syncDone;
        } catch (e) {
            console.log(e);
            dispatch(failure(e.toString()));
            let error = "Could not load 3Box";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ daemon, space, loggedIn: true }));
        dispatch(alertActions.success("Login with 3Box Successful"));
    };
}

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
