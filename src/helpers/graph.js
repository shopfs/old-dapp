import web3 from "web3";

export const allFilesQuery = `query {
  files {
    id
    metadataHash
    seller {
      address
    }
    price
    priceAsset
    numBuys
  }
}`;

export const fileQuery = fileId => {
    const hex = web3.utils.toHex(fileId);
    return `query {
      file(id: "${hex}") {
        id
        metadataHash
        seller {
          address
        }
        price
        priceAsset
        numBuys
      }
    }`;
};
