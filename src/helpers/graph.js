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

export const userOwnedFilesQuery = address => {
    return `query {
      user(id: "${address.toLowerCase()}") {
        id
        filesOwned {
          id
          metadataHash
          seller {
            address
          }
          price
          priceAsset
          numBuys
        }
      }
    }`;
};

export const userBoughtFilesQuery = address => {
    return `query {
      user(id: "${address.toLowerCase()}") {
        id
        filesBought {
          id
          metadataHash
          seller {
            address
          }
          price
          priceAsset
          numBuys
        }
      }
    }`;
};

export const userSubscriptionsQuery = address => {
    return `query {
      user(id: "${address.toLowerCase()}") {
        id
        subscriptions {
          id
          seller {
            address
          }
          subscriber {
            address
          }
          durationInSec
          isActive
          stopTime
          remainingBalance
          deposit
          tokenAddress
        }
      }
    }`;
};

export const userSubscribersQuery = address => {
    return `query {
      user(id: "${address.toLowerCase()}") {
        id
        subscribers {
          id
          seller {
            address
          }
          subscriber {
            address
          }
          durationInSec
          isActive
          stopTime
          remainingBalance
          deposit
          tokenAddress
        }
      }
    }`;
};

export const sellerSubscriptionInfoQuery = address => {
	return `query {
          user(id: "${address.toLowerCase()}") {
            id
            address
            isEnabled
            minDurationInDays
			amountPerDay
			tokenAddress            			
          }
        }`;
};

export const fileandSubQuery = (fileId,address) => {
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
          user(id: "${address.toLowerCase()}") {
            id
            address
            isEnabled
            minDurationInDays
			amountPerDay
			tokenAddress            			
          }
        }`;
};