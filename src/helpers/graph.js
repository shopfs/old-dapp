exports.allFilesQuery = `query {
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
}`

exports.getFileGraphQuery = async (fileId) => {
return `query {
  file(id: "${fileId}") {
    id
    metadataHash
    seller {
      address
    }
    price
    priceAsset
    numBuys
  }
}`
}
