import { logReceipt } from "../helpers";

export const marketService = {
    getFile,
    getAllFiles,
    checkHashExists,
    getPriceLimit,
    getFileCount,
    buy,
    sell
};

async function getFile(market, fileId) {
    return await market.methods.Files(parseInt(fileId)).call();
}

async function getFileCount(market) {
    return await market.methods.fileCount().call();
}

async function getPriceLimit(market) {
    return await market.methods.priceLimit().call();
}

async function checkHashExists(market, hash) {
    return await market.methods.hashExists(hash).call();
}

async function getAllFiles(market) {
    const fileCount = await getFileCount(market);
    return await Promise.all(
        Array(parseInt(fileCount))
            .fill(1)
            .map((el, i) => getFile(market, i))
    );
}

async function sell(market, erc20Address, price, fileHash, metadataHash) {
    const receipt = await market.methods
        .sell(erc20Address, parseInt(price), fileHash, metadataHash)
        .send();
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return {};
}

//must call approve on erc20Address before calling buy
async function buy(market, fileId) {
    const receipt = await market.methods.buy(parseInt(fileId)).send();
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return {};
}
