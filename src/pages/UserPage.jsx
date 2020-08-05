import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useQuery } from "urql";
import { userActions, boxActions } from "../actions";
import { getImageUrl, getAccountString } from "../helpers";
import UserOwnedFiles from "../components/UserOwnedFiles";
import UserBoughtFiles from "../components/UserBoughtFiles";
import UserSubscriptions from "../components/UserSubscriptions";
import UserSubscribers from "../components/UserSubscribers";
import SubscribeModal from "../components/SubscribeModal";
import UpdateSubscription from "../components/UpdateSubscription";
import "../assets/scss/userPage.scss";
import Loading from "../components/Loading";
import { userProfileQuery } from "../helpers/graph";

const UserPage = ({
    connected,
    account,
    updateSubscriptionInfo,
    disableSubscriptionInfo,
    data: { profile },
    match: {
        params: { address }
    },
    cleanBox,
    getProfile
}) => {
    const [user, setUser] = useState();
    const [seller, setSeller] = useState();
    const query = userProfileQuery(account, address);
    const [res, executeQuery] = useQuery({
        query: query,
        requestPollicy: "network-only"
    });
    useEffect(() => {
        if (res && !res.error && !res.fetching && res.data) {
            if (res.data.user) {
                const user = res.data.user;
                setUser(user);
                if (user && user.subscriptions && user.subscriptions.length) {
                    user.subscriptions.some(subscription => {
                        if (
                            subscription.seller.address ===
                            address.toLowerCase()
                        ) {
                            setSubscription(subscription);
                            return true;
                        }
                    });
                }
            }
            if (res.data.seller) {
                setSeller(res.data.seller);
            }
        }
    }, [res]);

    useEffect(() => {
        if (address) {
            cleanBox();
            getProfile(address);
        }
    }, [address]);

    const [selected, setSelected] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [subscription, setSubscription] = useState();

    if (res.fetching) return <Loading />;
    if (res.error) return <p>Errored!</p>;

    const isLoggedInUser =
        account && account.toLowerCase() == address.toLowerCase();

    return (
        <div className="userPage">
            {profile && (
                <>
                    <div
                        className="coverImage"
                        style={
                            profile.coverPhoto
                                ? {
                                      backgroundImage: `url(${getImageUrl(
                                          profile.coverPhoto
                                      )}`
                                  }
                                : {
                                      background: "#bdbdbd"
                                  }
                        }
                    ></div>
                    <div className="mainContent">
                        <div className="profileLeftBar">
                            <div className="profileImage">
                                {profile.image && (
                                    <img src={getImageUrl(profile.image)} />
                                )}
                            </div>
                            <div className="name">
                                {profile.emoji
                                    ? `${profile.name} ${profile.emoji}`
                                    : `${profile.name}`}
                            </div>
                            <div className="address">
                                {getAccountString(address)}
                            </div>
                            <div className="description">
                                {profile.description}
                            </div>
                            <a
                                className="boxProfile profileButton"
                                href={`https://3box.io/${address}${isLoggedInUser &&
                                    "/edit"}`}
                            >
                                {isLoggedInUser
                                    ? "Edit 3box Profile"
                                    : "View 3box Profile"}
                            </a>
                            {isLoggedInUser && (
                                <>
                                    <a
                                        className="profileButton"
                                        onClick={() => setSelected(0)}
                                    >
                                        My Files for Sale
                                    </a>
                                    <a
                                        className="profileButton"
                                        onClick={() => setSelected(1)}
                                    >
                                        Files I've Bought
                                    </a>
                                    <a
                                        className="profileButton"
                                        onClick={() => setSelected(2)}
                                    >
                                        My Subscribers
                                    </a>
                                    <a
                                        className="profileButton"
                                        onClick={() => setSelected(3)}
                                    >
                                        My Subscriptions
                                    </a>
                                    <a
                                        className="profileButton"
                                        onClick={() => setSelected(4)}
                                    >
                                        Update Subscription Info
                                    </a>
                                </>
                            )}
                            {!isLoggedInUser && (
                                <a
                                    className="subscribe profileButton"
                                    onClick={() => setShowModal(true)}
                                >
                                    {subscription ? "Subscribed" : "Subscribe"}
                                </a>
                            )}
                        </div>
                        <div className="profileRightBar">
                            {selected == 0 && (
                                <UserOwnedFiles
                                    address={address}
                                    isLoggedInUser={isLoggedInUser}
                                />
                            )}
                            {selected == 1 && (
                                <UserBoughtFiles
                                    address={address}
                                    isLoggedInUser={isLoggedInUser}
                                />
                            )}
                            {selected == 2 && (
                                <UserSubscribers
                                    address={address}
                                    isLoggedInUser={isLoggedInUser}
                                />
                            )}
                            {selected == 3 && (
                                <UserSubscriptions
                                    address={address}
                                    isLoggedInUser={isLoggedInUser}
                                />
                            )}
                            {selected == 4 && <UpdateSubscription />}
                            {showModal && (
                                <SubscribeModal
                                    seller={seller}
                                    subscription={subscription}
                                    close={() => {
                                        setShowModal(false);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </>
            )}{" "}
        </div>
    );
};

function mapState(state) {
    const { connected, account } = state.web3;
    const data = {
        ...state.user.data,
        ...state.box.data
    };
    return { data, connected, account };
}

const actionCreators = {
    cleanBox: boxActions.clean,
    getProfile: boxActions.getDataProfile
};

const connectedUserPage = connect(mapState, actionCreators)(UserPage);

export default connectedUserPage;
