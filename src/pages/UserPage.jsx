import React, { useEffect,useState } from "react";
import { connect } from "react-redux";
import { userActions, boxActions } from "../actions";
import "../assets/scss/userPage.scss";
import { getImageUrl, getAccountString } from "../helpers";
import Modal from '../components/Modal';
import "./styles.css";


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
	
    const isLoggedInUser = account && account.toLowerCase() == address.toLowerCase();
		
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
                            {!isLoggedInUser && (
                                <a className="subscribe profileButton">
                                    Subscribe
                                </a>
                            )}
							
                        </div>
						<div>
						{!show && (<button onClick={openModal}>suscribe</button>)}
						<Modal closeModal={closeModal} show={show} />
						</div>
                        <div className="profileRightBar">
                            <p>
                                {
                                    "User's files & subscriptions etc will come here"
                                }
                            </p>
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
    cleanBox: boxActions.clean,
    getProfile: boxActions.getDataProfile
};
const connectedUserPage = connect(mapState, actionCreators)(UserPage);
export default connectedUserPage;
