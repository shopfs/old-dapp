import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userActions, boxActions } from "../actions";
import "../assets/scss/userPage.scss";
import { getImageUrl, getAccountString } from "../helpers";

const UserPage = ({
    connected,
    account,
    data: { profile },
    match: {
        params: { address }
    },
    cleanBox,
    getProfile
}) => {
    useEffect(() => {
        if (address) {
            cleanBox();
            getProfile(address);
        }
    }, [address]);

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
                                : { background: "#808080" }
                        }
                    ></div>
                    <div className="mainContent">
                        <div className="leftBar">
                            <div className="profileImage">
                                {profile.image && (
                                    <img src={getImageUrl(profile.image)} />
                                )}
                            </div>
                            <div className="name">{profile.name}</div>
                            <div className="account">
                                {getAccountString(address)}
                            </div>
                            <div className="location">{profile.location}</div>
                            <div className="location">
                                {profile.description}
                            </div>
                            <a
                                className="boxProfile"
                                href={`https://3box.io/${address}`}
                            >
                                {account.toLowerCase() === address.toLowerCase()
                                    ? "Edit 3box Profile"
                                    : "View 3boxx Profile"}
                            </a>
                        </div>
                        <div className="rightBar">
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
                            <p>{profile.description}</p>
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
    return { data, connected };
}
const actionCreators = {
    getAllFiles: userActions.getAllFiles,
    cleanBox: boxActions.clean,
    getProfile: boxActions.getDataProfile
};
const connectedUserPage = connect(mapState, actionCreators)(UserPage);
export default connectedUserPage;
