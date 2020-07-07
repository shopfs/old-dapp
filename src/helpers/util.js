export function logReceipt(receipt) {
    console.log("Receipt: ");
    Object.keys(receipt).map((key, index) => {
        console.log(key, receipt[key]);
    });
}
