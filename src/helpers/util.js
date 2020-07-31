import config from "config";

export function logReceipt(receipt) {
    console.log("Receipt: ");
    Object.keys(receipt).map((key, index) => {
        console.log(key, receipt[key]);
    });
}

// epoch time conversion for creating subscription, we'll take the time in days
export function epochConversion(time) {
    let epochTime = {};
    let startTime = new Date().getTime();
    // setting up subscription start time as 2 minutes from the cuirrent time keeping in mind the transaction confirmation time since if the start time is less or equal to current time while in contract the tx will fail then
    startTime = startTime / 1000 + 120;

    let stopTime = new Date().getTime();
    // In epoch time 1 day is 86400 so to calculate stop time multiplying by no of days and adding it to current epoch time
    stopTime = stopTime / 1000 + 86400 * time + 120;
    epochTime["startTime"] = startTime;
    epochTime["stopTime"] = stopTime;
    return epochTime;
}

let tokenMapping = {};
export function getTokenSymbol(tokenAddress) {
    let tokenSymbol = tokenMapping[tokenAddress];
    if (tokenSymbol) {
        return tokenSymbol;
    }
    console.log("building mapping");
    for (let i = 0; i < config.priceAssets.length; ++i) {
        const token = config.priceAssets[i];
        tokenMapping[token.address] = token.symbol;
    }
    return tokenMapping[tokenAddress];
}
