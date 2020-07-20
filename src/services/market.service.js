import { logReceipt } from "../helpers";
import { ipldService } from "./ipld.service";

export const marketService = {
    getFile,
    getAllFiles,
    getBuyerFiles,
    checkHashExists,
    getPriceLimit,
    getFileCount,
    buy,
    sell
};

async function getFile(market, fileId) {
    let file = await market.methods.Files(parseInt(fileId)).call();
    file.price = file.price / 10 ** 18;
    const metadata = await ipldService.getMetadata(file.metadataHash);
    return { ...file, metadata };
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
    const fileCount = await getFileCount(market);
    console.log({fileCount});
    return await Promise.all(
        Array(parseInt(fileCount))
            .fill(1)
            .map((el, i) => getFile(market, i))
    );
}

async function sell(market, erc20Address, price, metadataHash) {
    const receipt = await market.methods
        .sell(erc20Address, BigInt(price * 10 ** 18), metadataHash)
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
