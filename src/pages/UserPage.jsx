import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { userActions, boxActions } from "../actions";
import { getImageUrl, getAccountString } from "../helpers";
import Modal from "../components/Modal";
import UserProfile from "../components/UserProfile";
import "../assets/scss/userPage.scss";

const UserPage = ({
    connected,
    account,
    data: { profile },
    match: {
        params: { address }
    },
    cleanBox,
    getProfile,
    createSubscription,
    cancelSubscription
}) => {
    useEffect(() => {
        if (address) {
            cleanBox();
            getProfile(address);
        }
    }, [address]);

    const isLoggedInUser =
        account && account.toLowerCase() == address.toLowerCase();
    const [selected, setSelected] = useState(0);

    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);

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
                                : { background: "#bdbdbd" }
                        }
                    ></div>
                    <div className="mainContent">
                        <div className="profileLeftBar">
                            <div className="profileImage">
                                {profile.image && (
                                    <img src={getImageUrl(profile.image)} />
                                )}
                            </div>
                            <div className="name">{`${profile.name} ${profile.emoji}`}</div>
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
                            {isLoggedInUser ? (
                                <>
                                    <a className="profileButton">
                                        My Files
                                    </a>
                                    <a className="profileButton">
                                        Bought Files
                                    </a>
                                    <a className="subscribe profileButton">
                                        Update Subscription Info
                                    </a>
                                    <a className="profileButton">Subscribers</a>
                                    <a className="profileButton">
                                        Subscriptions
                                    </a>
                                </>
                            ) : (
                                <a className="subscribe profileButton">
                                    Subscribe
                                </a>
                            )}
                        </div>
                        {/*<div>
						{!show && (<button onClick={openModal}>Subscribe</button>)}
						<Modal closeModal={closeModal} show={show} createSubscription={createSubscription} address={address} cancelSubscription={cancelSubscription} />
                        </div>*/}
                        <div className="profileRightBar">
                            <UserProfile
                                address={address}
                                isLoggedInUser={isLoggedInUser}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
function mapState(state) {
    const { connected, account } = state.web3;
    const data = { ...state.user.data, ...state.box.data };
    return { data, connected, account };
}
const actionCreators = {
    getAllFiles: userActions.getAllFiles,
    createSubscription: userActions.createSubscription,
    cancelSubscription: userActions.cancelSubscription,
    cleanBox: boxActions.clean,
    getProfile: boxActions.getDataProfile
};
const connectedUserPage = connect(mapState, actionCreators)(UserPage);
export default connectedUserPage;
