import { alertActions } from "./";
import { daemonConstants } from "../constants";
import { daemonService } from "../services";

export const daemonActions = {
    uploadFile
};

function uploadFile(filePath) {
    return async (dispatch, getState) => {
        dispatch(started());
        let threadInfo;
        try {
            const { account } = getState().web3;
            const bucketName = account + "." + Date.now()
            await daemonService.createBucket(bucketName)
            await daemonService.uploadFile(bucketName, filePath)
            threadInfo = await daemonService.shareBucket(bucketName)
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(
                alertActions.error("Error Uploading File: " + e.toString())
            );
            return;
        }
        dispatch(alertActions.success("Successfully Uploaded File"));
        dispatch(loaded({ data: { threadInfo } }));
        return threadInfo;
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
