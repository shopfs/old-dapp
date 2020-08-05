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
        buyers {
            address
          }
        price
        priceAsset
        numBuys
      }
    }`;
};

export const fileAndUserQuery = (fileId, user) => {
    const hex = web3.utils.toHex(fileId);
    if (user) {
        return `query {
          file(id: "${hex}") {
            id
            metadataHash
            seller {
              address
            }
            buyers {
                address
              }
            price
            priceAsset
            numBuys
          }
          user(id: "${user.toLowerCase()}") {
            address
            subscriptions {
              seller {
                address
              }
            }
          }  
        }`;
    }
    return fileQuery(fileId);
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

export const userProfileQuery = (user, seller) => {
    return `query {
      user: user(id: "${user.toLowerCase()}") {
        address
        subscriptions {
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
      seller: user(id: "${seller.toLowerCase()}") {
        address
        isEnabled
        minDurationInDays
		amountPerDay
		tokenAddress            			
      }
    }`;
};

export const userSubscriptionsQuery = address => {
    return `query {
      user(id: "${address.toLowerCase()}") {
        id
        isEnabled
        subscriptions {
          id
          streamId
          seller {
            address
          }
          subscriber {
            address
          }
          durationInSec
          isActive
          startTime
          stopTime
          remainingBalance
          ratePerSecond
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
          streamId
          seller {
            address
          }
          subscriber {
            address
          }
          durationInSec
          isActive
          startTime
          stopTime
          remainingBalance
          ratePerSecond
          deposit
          tokenAddress
        }
      }
    }`;
};

export const fileandSubQuery = (fileId, address) => {
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
