import Box from "3box";
import { alertActions } from "./";
import { boxConstants } from "../constants";

export const boxActions = {
    loadbox,
    loadProfile,
    getDataProfile,
    getProfiles,
    createThread,
    createConfidentialThread,
    joinThread,
    addModerator,
    postMessage,
    getPosts,
    clean
};

function loadbox(account) {
    return async (dispatch, getState) => {
        dispatch(started());
        let box, space;
        try {
            box = await Box.openBox(account, window.ethereum);
            console.log({box});
            space = await box.openSpace(boxConstants.SPACE_NAME);
            console.log({space});
            await box.syncDone;
            await space.syncDone;
        } catch (e) {
            console.log(e);
            dispatch(failure(e.toString()));
            let error = "Could not load 3Box";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ box, space, loggedIn: true }));
        dispatch(alertActions.success("Login with 3Box Successful"));
    };
}

function loadProfile(account) {
    return async (dispatch, getState) => {
        dispatch(started());
        let profile;
        try {
            profile = await Box.getProfile(account);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load 3Box Profile";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ profile }));
    };
}

function getDataProfile(userAddress) {
    return async (dispatch, getState) => {
        dispatch(started());
        let profile;
        try {
            profile = await Box.getProfile(userAddress);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not get 3Box Profile";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ data: { profile } }));
    };
}

function getProfiles(accounts) {
    return async (dispatch, getState) => {
        dispatch(started());
        let profiles;
        try {
            profiles = await Promise.all(
                accounts.map(account => Box.getProfile(account))
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            return;
        }
        dispatch(loaded({ data: { profiles } }));
    };
}

function createThread(threadName) {
    return async (dispatch, getState) => {
        dispatch(started());
        let thread;
        try {
            const { space } = getState().box;
            thread = await space.joinThread(threadName, { members: true });
            await space.syncDone;

            console.log("space DID: ", space.DID);
            console.log("public thread created: ", thread.address);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            return;
        }
        dispatch(loaded({ data: { thread } }));
    };
}

function createConfidentialThread(threadName) {
    return async (dispatch, getState) => {
        dispatch(started());
        let thread;
        try {
            const { space } = getState().box;
            thread = await space.createConfidentialThread(threadName, {
                members: true
            });
            await space.syncDone;

            console.log("space DID: ", space.DID);
            console.log("confidential thread created: ", thread.address);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            return;
        }
        dispatch(loaded({ data: { thread } }));
    };
}

function addModerator(address) {
    return async (dispatch, getState) => {
        dispatch(started());
        let thread;
        try {
            const { data, space } = getState().box;
            thread = data.thread;
            await thread.addModerator(address);
            await space.syncDone;
            console.log("moderator addedd: ", address);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            return;
        }
        dispatch(loaded({}));
    };
}

function postMessage(message) {
    return async (dispatch, getState) => {
        dispatch(started());
        let thread;
        try {
            const { data, space } = getState().box;
            thread = data.thread;
            await thread.post(message);
            await space.syncDone;
            console.log("message posted: ", message);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            return;
        }
        dispatch(loaded({}));
    };
}

//function getThread(space, name, firstModerator, members) {
//    return async (dispatch, getState) => {
//        dispatch(started());
//        let thread1;
//        try {
//            thread1 = await Box.getThread(space, name, firstModerator, members);
//        } catch (e) {
//            console.log(e);
//            dispatch(failure(e));
//            let error = "Could not load 3Box thread for space";
//            dispatch(alertActions.error(error));
//            return;
//        }
//        dispatch(loaded({ thread1 }));
//    };
//}

function joinThread(orbitdbAddress) {
    return async (dispatch, getState) => {
        dispatch(started());
        let thread;
        try {
            const { space } = getState().box;
            console.log("start");
            thread = await space.joinThreadByAddress(orbitdbAddress, { accessTimeout: 60000});
            await space.syncDone;

            console.log("space DID: ", space.DID);
            console.log("thread joined: ", thread.address);
            console.log("moderators: ", await thread.listModerators());
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load 3Box thread for space";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ data: { thread } }));
    };
}

function getPosts() {
    return async (dispatch, getState) => {
        dispatch(started());
        let posts;
        try {
            const { data, space } = getState().box;
            let thread = data.thread;
            posts = await thread.getPosts();
            await space.syncDone;
            console.log("found posts: ", posts);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load 3Box thread for space";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ data: { posts } }));
    };
}

function clean() {
    return dispatch => {
        dispatch({
            type: boxConstants.CLEAN
        });
    };
}

function started() {
    return {
        type: boxConstants.STARTED
    };
}

function loaded(box) {
    return {
        type: boxConstants.LOADED,
        ...box
    };
}

function failure(error) {
    return {
        type: boxConstants.ERROR,
        error
    };
}
