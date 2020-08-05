import React, { useState } from "react";
import { connect } from "react-redux";
import { userActions } from "../actions";
import { history, getTokenSymbol } from "../helpers";
import { Link } from "react-router-dom";
import ProfileHover from "profile-hover";
import pricetag from "../assets/img/pricetag.svg";
import "../assets/scss/subscriptionsDisplay.scss";

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

const SubscriptionsDisplay = ({
    allSubscriptions,
    seller,
    withdrawFromSubscription,
    cancelSubscription
}) => {
    return (
        <div className="subscriptionsDisplay">
            {allSubscriptions &&
                allSubscriptions.map((subscription, index) => (
                    <div className="subscriptionItem" key={index.toString()}>
                        {!seller && (
                            <>
                                <span>Seller:</span>
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
                            </>
                        )}
                        {seller && (
                            <>
                                <span>Subscriber:</span>
                                <div
                                    className="subscriber"
                                    onClick={() => {
                                        history.push(
                                            `/users/${subscription.subscriber.address}`
                                        );
                                    }}
                                >
                                    <ProfileHover
                                        address={
                                            subscription.subscriber.address
                                        }
                                        orientation="bottom"
                                        tileStyle
                                    />
                                </div>
                            </>
                        )}
                        <span className="duration">{`Total Duration: ${subscription.durationInSec /
                            86400} days`}</span>
                        <span className="remaining">{`Remaining Time: ${secondsToDhms(
                            subscription.stopTime - new Date().getTime() / 1000
                        )}`}</span>
                        <span className="isExpired">{`isExpired: ${new Date(
                            subscription.stopTime
                        ) < new Date()}`}</span>
                        <span className="isActive">{`isActive: ${subscription.isActive}`}</span>
                        <span className="deposit">
                            {`Deposit: ${(
                                subscription.deposit /
                                10 ** 18
                            ).toFixed(2)} ${getTokenSymbol(
                                subscription.tokenAddress
                            )} (${subscription.deposit})`}
                        </span>
                        <span className="remainingBalance">{`Balance: ${(
                            subscription.remainingBalance /
                            10 ** 18
                        ).toFixed(2)} ${getTokenSymbol(
                            subscription.tokenAddress
                        )} (${subscription.remainingBalance})`}</span>
                        {seller && (
                            <a
                                className="subscriptionButton button"
                                onClick={() => {
                                    let amount =
                                        (BigInt(
                                            parseInt(
                                                new Date().getTime() / 1000
                                            )
                                        ) -
                                            BigInt(subscription.startTime)) *
                                        BigInt(subscription.ratePerSecond);
                                    if (
                                        amount >
                                        BigInt(subscription.remainingBalance)
                                    ) {
                                        amount = subscription.remainingBalance;
                                    } else {
                                        amount = amount - BigInt(subscription.ratePerSecond);
                                    }
                                    withdrawFromSubscription(
                                        subscription.streamId,
                                        amount
                                    );
                                }}
                            >
                                Withdraw Balance
                            </a>
                        )}
                        {!seller && (
                            <a
                                className="subscriptionButton button"
                                onClick={() => {
                                    cancelSubscription(
                                        subscription.seller.address
                                    );
                                }}
                            >
                                Cancel Subscription
                            </a>
                        )}
                    </div>
                ))}
        </div>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    withdrawFromSubscription: userActions.withdrawFromSubscription,
    cancelSubscription: userActions.cancelSubscription
};

const connectedSubscriptionsDisplay = connect(
    mapState,
    actionCreators
)(SubscriptionsDisplay);

export default connectedSubscriptionsDisplay;
