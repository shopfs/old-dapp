import { useQuery } from "urql";
import React from "react";

const UserProfile = ({ address, isLoggedInUser }) => {
    const [res, executeQuery] = useQuery({
        query: `
        query {
          user(id: "${address.toLowerCase()}") {
            id
            address
            isEnabled
            filesOwned {
              id
              price
              metadataHash
              priceAsset
              buyers {
                id
              }
            }
            filesBought {
              id
              price
              metadataHash
              priceAsset
              seller {
                id
              }
            }
            subscriptions {
              id
              isActive
            }
          }
        }
      `
    });
    if (res.fetching) return <p>Loading...</p>;
    if (res.error) return <p>Errored!</p>;
    let user = res.data.user;
    return (
        <div className="userProfile">
            {user && (
                <>
                    <p> {user.id} </p>
                </>
            )}
        </div>
    );
};

export default UserProfile;
