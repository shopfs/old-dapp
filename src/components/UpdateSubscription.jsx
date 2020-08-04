import React, { useState, useEffect } from "react";
import config from "config";
import { connect } from "react-redux";
import { userActions } from "../actions";
import { getTokenSymbol } from "../helpers";

const UpdateSubscription = ({
    updateSubscriptionInfo,
    disableSubscriptionInfo,
    user
}) => {
    const defaultAsset = config.priceAssets[0].address;
    const [asset, setAsset] = useState(defaultAsset);
    const [amount, setAmount] = useState("");
    const [days, setDays] = useState("");

    useEffect(() => {
        if (user.isEnabled) {
            setAsset(user.tokenAddress);
            setAmount(user.amountPerDay);
            setDays(user.minDurationInDays);
        }
    });

    return (
        <>
            <h1>Update Subscription Info</h1>
            <p>Subscription: {user.isEnabled ? "Enabled" : "Disabled"} </p>
            {user.isEnabled && (
                <>
                    <p> Token: {getTokenSymbol(user.tokenAddress)}</p>
                    <p> Amount Per Day: {user.amountPerDay}</p>
                    <p> Min Days: {user.minDurationInDays} </p>
                </>
            )}

            <label htmlFor="amount">Amount Per Day</label>
            <input
                id="amount"
                type="number"
                placeholder=""
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <label htmlFor="days">Minimum Days</label>
            <input
                id="days"
                type="number"
                placeholder=""
                value={days}
                onChange={e => setDays(e.target.value)}
            />
            <label htmlFor="asset">Token</label>
            <select
                className="asset"
                onChange={e => {
                    setAsset(e.target.value);
                    console.log(e.target.value);
                }}
                value={asset}
            >
                {config.priceAssets &&
                    config.priceAssets.map((asset, index) => (
                        <option value={asset.address} key={index}>
                            {asset.symbol}
                        </option>
                    ))}
            </select>
            <button
                onClick={e => {
                    updateSubscriptionInfo(amount, days, asset);
                }}
            >
                Update Subscription Info
            </button>
            {user.isEnabled && (
                <button
                    onClick={e => {
                        disableSubscriptionInfo();
                    }}
                >
                    Disable Subscription Info
                </button>
            )}
        </>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    updateSubscriptionInfo: userActions.updateSubscriptionInfo,
    disableSubscriptionInfo: userActions.disableSubscriptionInfo
};

const connectedUpdateSubscription = connect(
    mapState,
    actionCreators
)(UpdateSubscription);

export default connectedUpdateSubscription;
