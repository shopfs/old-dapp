import { logReceipt } from "../helpers";

export const erc20Service = {
    approve
};

async function approve(erc20, spender, value) {
    const receipt = await erc20.methods.approve(spender, value.toString()).send();
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return {};
}
