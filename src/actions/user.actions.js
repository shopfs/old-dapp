import { alertActions } from "./";
import config from "config";
import { userConstants } from "../constants";
import fleekStorage from "@fleekhq/fleek-storage-js";
import {
    daemonService,
    marketService,
    erc20Service,
    ipldService,
    keysService
} from "../services";

export const userActions = {
    clean,
    getFile,
    getAllFiles,
    getPriceLimit,
    getFileCount,
    buy,
    uploadImage,
    downloadFile,
    uploadAndSellFile
};

function clean() {
    return dispatch => {
        dispatch({
            type: userConstants.CLEAN
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
            dispatch(alertActions.error("Error Getting File"));
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
            dispatch(alertActions.error("Error Getting FileCount"));
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
            dispatch(alertActions.error("Error Getting PriceLimit"));
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
            dispatch(alertActions.error("Error Getting All Files"));
            return;
        }
        dispatch(result({ data: { allFiles } }));

        return allFiles;
    };
}

function uploadAndSellFile(path, description, imageHash, price) {
    return async (dispatch, getState) => {
        dispatch(started());
        try {
            const { account, market, web3 } = getState().web3;
            const priceLimit = await marketService.getPriceLimit(market);
            if (parseInt(price) > parseInt(priceLimit)) {
                throw "Price higher than priceLimit (" + priceLimit + " DAI)";
            }

            // const bucketName = "bucket_" + account + "_" + Date.now();
            const bucketName = "bucket" + Date.now();
            console.log({ bucketName });
            const fileName = path.replace(/^.*[\\\/]/, "");
            console.log({ fileName });

            // await daemonService.createBucket(bucketName);
            // await daemonService.createFolder(bucketName);
            const threadInfo = await daemonService.uploadFile(bucketName, path);
            // const threadInfo = await daemonService.shareBucket(bucketName);
            // const filePath = await daemonService.getFilePath(bucketName);

            console.log({ threadInfo });
            const metadataHash = await ipldService.uploadMetadata({
                fileName,
                path,
                bucketName,
                description,
                imageHash
            });
            console.log("got metadataHash");

            console.log({ metadataHash });

            const fileId = await marketService.sell(
                market,
                config.testnetDAIAddress,
                price,
                metadataHash
            );
            console.log("file sold on market");

            const signature = await web3.eth.personal.sign(fileId, account);
            console.log("fileId signed");
            console.log({ signature });

            await keysService.putThreadData(fileId, {
                threadInfo,
                // path: filePath,
                bucketName,
                signature
            });
            console.log("thread data uploaded");
        } catch (error) {
            console.log({ error });
            dispatch(failure(error));
            dispatch(alertActions.error("Error Selling File"));
            return;
        }
        dispatch(alertActions.success("Successfully Sold File"));
        dispatch(done());
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
            dispatch(alertActions.error("Error Buying File: " + data.error));
        }
    };
}

function downloadFile(fileId) {
    return async (dispatch, getState) => {
        dispatch(started());
        try {
            const { account, web3 } = getState().web3;
            console.log("sign fileId");
            const signature = await web3.eth.personal.sign(
                fileId.toString(),
                account
            );
            console.log({ signature });
            const threadData = await keysService.getThreadData(
                fileId,
                signature
            );
            console.log({ threadData });
            // await daemonService.joinBucket(
            //     threadData.bucketName,
            //     threadData.threadInfo
            // );
            // const filePath = await daemonService.getFilePath(
            //     threadData.bucketName
            // );
            // console.log("bucketJoined");
            const location = await daemonService.openFile(
                threadData.bucketName,
                threadData.threadInfo
                // filePath
            );
            console.log({ location });
        } catch (error) {
            console.log({ error });
            dispatch(failure(error));
            return;
        }
        dispatch(done());
    };
}

function uploadImage(file) {
    return async (dispatch, getState) => {
        dispatch(started());
        let imageHash;
        try {
            const uploadedFile = await fleekStorage.upload({
                apiKey: "9cILwykg8eJ7JifGfuS4zA==",
                apiSecret: "u1gcUczk4+o3B0XBP2A0DcWABEvDqUdxz06MgXc3FRA=",
                key: file.name,
                data: file
            });
            imageHash = uploadedFile.hash;
        } catch (error) {
            console.log({ error });
            dispatch(failure(error));
            return;
        }
        dispatch(done());
        return imageHash;
    };
}

function started() {
    return {
        type: userConstants.STARTED
    };
}

function done() {
    return {
        type: userConstants.DONE
    };
}

function cleanSelected(result) {
    return {
        type: userConstants.CLEAN_SELECTED,
        ...result
    };
}

function result(result) {
    return {
        type: userConstants.RESULT,
        ...result
    };
}

function failure(error) {
    return {
        type: userConstants.ERROR,
        error
    };
}
