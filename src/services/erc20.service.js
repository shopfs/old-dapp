import { logReceipt } from "../helpers";

export const erc20Service = {
    approve
};

async function approve(erc20, spender, value) {
    const bigValue = BigInt(value * 10 ** 18);
    const receipt = await erc20.methods.approve(spender, bigValue).send();
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return {};
}
