import { logReceipt } from "../helpers";
import { ipfsService } from "./ipfs.service";
import  graphConfig   from "../helpers/graph";
import config from "config";
import axios from "axios"

export const marketService = {
    getFile,
    getFileFromContract,
    getAllFiles,
    getBuyerFiles,
    checkHashExists,
    getPriceLimit,
    getFileCount,
    buy,
    sell,
    createSubscription,
    withdrawSubscriptionAmount,
    cancelSubscription,
    isValidStream
};

async function getFile(file) {
    file.price = file.price / 10 ** 18;
    const metadata = await ipfsService.getMetadata(file.metadataHash);
    return { ...file, metadata };
}


async function getFileFromContract(market, fileId) {
    let file = await market.methods.Files(fileId).call();
    file.price = file.price / 10 ** 18;
    return file
}

async function getFileCount(market) {
    return await market.methods.fileCount().call();
}

async function getPriceLimit(market) {
    const priceLimit = await market.methods.priceLimit().call();
    return priceLimit / 10 ** 18;
}

async function checkHashExists(market, hash) {
    return await market.methods.hashExists(hash).call();
}

async function getBuyerFiles(market, buyer) {
    return await market.methods.buyerInfo(buyer).call();
}

async function getAllFiles(market) {
    const query = graphConfig.allFilesQuery
    const res = await axios.post(config.graphUrl, {query: query })
    const allFiles = res.data.data.files
    const fileCount = res.data.data.files.length;
    return await Promise.all(
        Array(parseInt(fileCount))
            .fill(1)
            .map((el, i) => getFile(allFiles[i]))
    );
}

async function sell(market, erc20Address, price, metadataHash) {
    const receipt = await market.methods
        .sell(erc20Address, BigInt(price * 10 ** 18), metadataHash)
        .send();
    if (!receipt.status) {
        logReceipt(receipt);
        throw "Transaction failed";
    }
    return receipt.events["Sell"].returnValues.fileId;
}

//must call approve on erc20Address before calling buy
async function buy(market, fileId) {
    const receipt = await market.methods.buy(parseInt(fileId)).send();
    if (!receipt.status) {
        logReceipt(receipt);
        throw "Transaction failed";
    }
    return {};
}

// to be used for expired subscriptions
async function isValidStream(market, streamId) {
    return await market.methods.isValid(streamId).call()
}

// call approve before in actiom
async function createSubscription(market, amount, paymentAsset, numofdays, seller) {
    const receipt = await market.methods.createSubscription(BigInt(amount * 10 ** 18), paymentAsset, numofdays, seller).send()
 if (!receipt.status) {
        logReceipt(receipt);
        throw "Transaction failed";
    }
    return {};
}

// seller clicks wothdraw for that particular subscription to get the funds locked, buyer address needed for filtering in mapping
async function withdrawSubscriptionAmount(market, streamId, amount) {
 const receipt = await market.methods.withdrawFromSubscription(streamId, BigInt(amount * 10 ** 18)).send()
 if (!receipt.status) {
        logReceipt(receipt);
        throw "Transaction failed";
    }
    return {};
}

// buyer clicks on cancel for that particular seller
async function cancelSubscription(market, seller) {
 const receipt = await market.methods.cancelSubscription(seller).send()
 if (!receipt.status) {
        logReceipt(receipt);
        throw "Transaction failed";
    }
    return {};
}
