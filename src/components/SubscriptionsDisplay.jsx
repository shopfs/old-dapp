import React, { useState } from "react";
import { connect } from "react-redux";
import { userActions } from "../actions";
import { history, getTokenSymbol } from "../helpers";
import { Link } from "react-router-dom";
import ProfileHover from "profile-hover";
import pricetag from "../assets/img/pricetag.svg";
import "../assets/scss/subscriptionsDisplay.scss";

const SubscriptionsDisplay = ({ allSubscriptions }) => {
    return (
        <div className="subscriptionsDisplay">
            {allSubscriptions &&
                allSubscriptions.map((subscription, subscriptionId) => (
                    <div
                        className="subscriptionItem"
                        key={subscriptiion.streamId}
                    >
                        <div
                            className="seller"
                            onClick={() => {
                                history.push(
                                    `/users/${subscription.seller.address}`
                                );
                            }}
                        >
                            <ProfileHover
                                address={subscription.seller.address}
                                orientation="bottom"
                                tileStyle
                            />
                        </div>
                        <div
                            className="subscriber"
                            onClick={() => {
                                history.push(
                                    `/users/${subscription.subscriber.address}`
                                );
                            }}
                        >
                            <ProfileHover
                                address={subscription.subscriber.address}
                                orientation="bottom"
                                tileStyle
                            />
                        </div>
                        <span className="duration">{`Duration: ${subscription.durationInSec /
                            86400}`}</span>
                        <span className="isExpired">{`isExpired: ${new Date(
                            subscription.stopTime
                        ) < new Date()}`}</span>
                        <span className="isActive">{`isActive: ${subscription.isActive}`}</span>
                        <span className="deposit">{`Deposit: ${(
                            subscription.deposit /
                            10 ** 18
                        ).toFixed(2)} ${getTokenSymbol(
                            subscription.tokenAddress
                        )}`}</span>
                        <span className="remainingBalance">{`Balance: ${(
                            subscription.remainingBalance /
                            10 ** 18
                        ).toFixed(2)} ${getTokenSymbol(
                            subscription.tokenAddress
                        )}`}</span>
                    </div>
                ))}
        </div>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedSubscriptionsDisplay = connect(
    mapState,
    actionCreators
)(SubscriptionsDisplay);

export default connectedSubscriptionsDisplay;
