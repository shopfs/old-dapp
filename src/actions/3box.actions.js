import Box from "3box";
import { alertActions } from "./";
import { boxConstants } from "../constants";

export const boxActions = {
    loadbox,
    loadProfile,
    getDataProfile,
    getProfiles,
    clean
};

function loadbox(account) {
    return async (dispatch, getState) => {
        dispatch(started());
        let box, space;
        try {
           //authenticate user's 3box auth  
			const box = await Box.openBox(
			account,
			window.ethereum);
			console.log(box);
			//authenticate users's space for ipfsethmarketplace app
			//for new user it will create ipfsethmarketplace space
			//for exissting user it will access his ipfsethmarketplace space
			space = await box.openSpace(
			boxConstants.SPACE_NAME);
			console.log(space)
			//wait till user's data is synced from network
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

//displays all post in thread also
function getThread(space, name, firstModerator, members) {
    return async (dispatch, getState) => {
        dispatch(started());
        let thread1;
        try {
            thread1 = await Box.getThread(space, name, firstModerator, members);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load 3Box thread for space";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ thread1 }));
    };
}

//
function joinThread(name) {
    return async (dispatch, getState) => {
        dispatch(started());
        let thread2;
        try {
            thread2 = await space.joinThread(name);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load 3Box thread for space";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({ thread2 }));
    };
}

//get post,add moderator,send message in thread(thread.post) left

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