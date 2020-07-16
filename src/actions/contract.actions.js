import { alertActions } from "./";
import config from "config";
import { contractConstants } from "../constants";
import { marketService, erc20Service } from "../services";
import { client } from "../helpers/daemon.js"

console.log(client)
export const contractActions = {
    clean,
    getFile,
    getAllFiles,
    getPriceLimit,
    getFileCount,
    buy,
    sell
};

function clean() {
    return dispatch => {
        dispatch({
            type: contractConstants.CLEAN
        });
    };
}

function getFile(fileId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let file;
        try {
            const { account, market } = getState().web3;
            file = await marketService.getFile(market, fileId);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Greeting"));
            return;
        }
        dispatch(result({ data: { file } }));

        return file;
    };
}

function getFileCount() {
    return async (dispatch, getState) => {
        dispatch(started());
        let fileCount;
        try {
            const { account, market } = getState().web3;
            fileCount = await marketService.getFileCount(market);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Greeting"));
            return;
        }
        dispatch(result({ data: { fileCount } }));

        return fileCount;
    };
}

function getPriceLimit() {
    return async (dispatch, getState) => {
        dispatch(started());
        let priceLimit;
        try {
            const { account, market } = getState().web3;
            priceLimit = await marketService.getPriceLimit(market);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Greeting"));
            return;
        }
        dispatch(result({ data: { priceLimit } }));

        return priceLimit;
    };
}

function getAllFiles() {
    return async (dispatch, getState) => {
        dispatch(started());
        let allFiles;
        try {
            const { account, market } = getState().web3;
            allFiles = await marketService.getAllFiles(market);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Getting Greeting"));
            return;
        }
        dispatch(result({ data: { allFiles } }));

        return allFiles;
    };
}

function sell(price, fileHash, fileDescription) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        try {
            // adding Daemon code
            const { account, market } = getState().web3;
            const priceLimit = await marketService.getPriceLimit(market);
            if (parseInt(price) > parseInt(priceLimit)) {
                throw "Price higher than priceLimit (" + priceLimit + " DAI)";
            }
            data = await marketService.sell(
                market,
                config.testnetDaiAddress,
                price,
                fileHash,
                fileDescription
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Selling File: " + e.toString()));
            return;
        }
        if (!data.error) {
            dispatch(alertActions.success("Successfully Sold File"));
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Selling File: " + data.error)
            );
        }
    };
}

function buy(fileId) {
    return async (dispatch, getState) => {
        dispatch(started());
        let data;
        try {
            const { account, market, dai } = getState().web3;
            const file = await marketService.getFile(market, fileId);
            data = await erc20Service.approve(
                dai,
                config.marketAddress,
                file.price
            );
            if (data.error) {
                throw "Could not approve Market to transfer DAI";
            }
            data = await marketService.buy(market, fileId);
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            dispatch(alertActions.error("Error Buying File: " + e.toString()));
            return;
        }
        if (!data.error) {
            dispatch(alertActions.success("Successfully Bought File"));
            dispatch(done());
        } else {
            dispatch(failure(data.error));
            dispatch(
                alertActions.error("Error Buying File: " + data.error)
            );
        }
    };
}

function started() {
    return {
        type: contractConstants.STARTED
    };
}

function done() {
    return {
        type: contractConstants.DONE
    };
}

function cleanSelected(result) {
    return {
        type: contractConstants.CLEAN_SELECTED,
        ...result
    };
}

function result(result) {
    return {
        type: contractConstants.RESULT,
        ...result
    };
}

function failure(error) {
    return {
        type: contractConstants.ERROR,
        error
    };
}
