import dagCBOR from "ipld-dag-cbor";

export const ipldService = {
    serializeFile
};

async function serializeFile(price, fileHash, fileDescription) {
    const filePayload = {};
    filePayload["price"] = price;
    filePayload["fileHash"] = fileHash;
    filePayload["fileDescription"] = fileDescription;
    return await dagCBOR.util.serialize(filePayload);
}
