import ipfsClient from "ipfs-http-client";
import CID from "cids";

const ipfs = new ipfsClient({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https"
});

export const ipldService = {
    uploadMetadata,
    getMetadata
};

async function uploadMetadata(metadata) {
    const node = await ipfs.dag.put(metadata);
    const cids = new CID(1, "dag-cbor", node.multihash);
    return cids.toBaseEncodedString();
}

async function getMetadata(cid) {
    const data = await ipfs.dag.get(cid);
    return data.value
}
