import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {useQuery} from "urql";
import {userSubscriptionsQuery} from "../helpers/graph";
import {userActions, boxActions} from "../actions";
import {getImageUrl, getAccountString} from "../helpers";
import Modal from "../components/Modal";
import UserOwnedFiles from "../components/UserOwnedFiles";
import UserBoughtFiles from "../components/UserBoughtFiles";
import UserSubscriptions from "../components/UserSubscriptions";
import UserSubscribers from "../components/UserSubscribers";
import Subscribe from "../components/Subscribe";
import UpdateSubscription from "../components/UpdateSubscription";
import "../assets/scss/userPage.scss";

const UserPage = ({
    connected,
    account,
    updateSubscriptionInfo,
    disableSubscriptionInfo,
    data: {
        profile
    },
    match: {
        params: {
            address
        }
    },
    cleanBox,
    getProfile,
    createSubscription,
    cancelSubscription
}) => {

    const [userSubscriptions, setSubscriptions] = useState();
    const query = userSubscriptionsQuery(address);
    // check if the user has already bought the file
    const [res, executeQuery] = useQuery({query: query});
    useEffect(() => {
        console.log(res)
        if (res && !res.error && !res.fetching && res.data.user) {
            let userSubscriptions = res.data.user;
            console.log(userSubscriptions)
            setSubscriptions(userSubscriptions)
        }
    }, [res]);


    useEffect(() => {
        if (address) {
            cleanBox();
            getProfile(address);
        }
    }, [address]);

    const isLoggedInUser = account && account.toLowerCase() == address.toLowerCase();
    const [selected, setSelected] = useState(0);

    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);

    return (
        <div className="userPage">
            {
            profile && userSubscriptions && (
                <>
                    <div className="coverImage"
                        style={
                            profile.coverPhoto ? {
                                backgroundImage: `url(${
                                    getImageUrl(profile.coverPhoto)
                                }`
                            } : {
                                background: "#bdbdbd"
                            }
                    }></div>
                    <div className="mainContent">
                        <div className="profileLeftBar">
                            <div className="profileImage">
                                {
                                profile.image && (
                                    <img src={
                                        getImageUrl(profile.image)
                                    }/>
                                )
                            } </div>
                            <div className="name">
                                {
                                `${
                                    profile.name
                                } ${
                                    profile.emoji
                                }`
                            }</div>
                            <div className="address">
                                {
                                getAccountString(address)
                            } </div>
                            <div className="description">
                                {
                                profile.description
                            } </div>
                            <a className="boxProfile profileButton"
                                href={
                                    `https://3box.io/${address}${
                                        isLoggedInUser && "/edit"
                                    }`
                            }>
                                {
                                isLoggedInUser ? "Edit 3box Profile" : "View 3box Profile"
                            } </a>
                            {
                            isLoggedInUser && (
                                <>
                                    <a className="subscribe profileButton"
                                        onClick={
                                            () => setSelected(5)
                                    }>
                                        Update Subscription Info
                                    </a>
                                    <a className="profileButton"
                                        onClick={
                                            () => setSelected(0)
                                    }>
                                        My Files
                                    </a>
                                    <a className="profileButton"
                                        onClick={
                                            () => setSelected(1)
                                    }>
                                        Bought Files
                                    </a>
                                    <a className="profileButton"
                                        onClick={
                                            () => setSelected(2)
                                    }>
                                        Subscribers
                                    </a>
                                    <a className="profileButton"
                                        onClick={
                                            () => setSelected(3)
                                    }>
                                        Subscriptions
                                    </a>
                                </>
                            )
                        }
                            {
                            ! isLoggedInUser && !userSubscriptions.subscriptions.some(subscription => subscription.subscriber.address === account.toLowerCase() && user.isActive) && userSubscriptions.isEnabled && <a className="subscribe profileButton"
                                onClick={
                                    () => setSelected(4)
                            }>
                                Subscribe
                            </a>
                        } </div>
                        <div className="profileRightBar">
                            {
                            selected == 0 ? (
                                <UserOwnedFiles address={address}
                                    isLoggedInUser={isLoggedInUser}/>
                            ) : selected == 1 ? (
                                <UserBoughtFiles address={address}
                                    isLoggedInUser={isLoggedInUser}/>
                            ) : selected == 2 ? (
                                <UserSubscribers address={address}
                                    isLoggedInUser={isLoggedInUser}/>
                            ) : selected == 4 ? (
                                <Subscribe createSubscription={createSubscription}
                                    address={address}
                                    cancelSubscription={cancelSubscription}/>
                            ) : selected == 5 ? (
                                <UpdateSubscription updateSubscriptionInfo={updateSubscriptionInfo}
                                    disableSubscriptionInfo={disableSubscriptionInfo}/>
                            ) : (
                                <UserSubscriptions address={address}
                                    isLoggedInUser={isLoggedInUser}/>
                            )
                        } </div>
                    </div>
                </>
            )
        } </div>
    );
};
function mapState(state) {
    const {connected, account} = state.web3;
    const data = {
        ... state.user.data,
        ... state.box.data
    };
    return {data, connected, account};
}
const actionCreators = {
    getAllFiles: userActions.getAllFiles,
    createSubscription: userActions.createSubscription,
    cancelSubscription: userActions.cancelSubscription,
    updateSubscriptionInfo: userActions.updateSubscriptionInfo,
    disableSubscriptionInfo: userActions.disableSubscriptionInfo,
    cleanBox: boxActions.clean,
    getProfile: boxActions.getDataProfile
};
const connectedUserPage = connect(mapState, actionCreators)(UserPage);
export default connectedUserPage;

