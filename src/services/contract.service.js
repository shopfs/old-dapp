import { logReceipt } from "../helpers";

export const contractService = {
    getGreeting,
    setGreeting
};

async function getGreeting(contract, account) {
    return await contract.methods.get().call({ from: account });
}

async function setGreeting(contract, account, greeting) {
    const receipt = await contract.methods
        .set(greeting)
        .send({ from: account });
    if (!receipt.status) {
        logReceipt(receipt);
        return { error: "Transaction failed" };
    }
    return {};
}
