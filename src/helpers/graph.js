exports.allFilesQuery = `{
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
return `{
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
