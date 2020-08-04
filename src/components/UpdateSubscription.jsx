import React, { useState, useEffect } from "react";
import config from "config";
import { connect } from "react-redux";
import { userActions } from "../actions";
import { getTokenSymbol } from "../helpers";
import "../assets/scss/updateSubscriptionInfo.scss";

const UpdateSubscription = ({
    getSubscriptionInfo,
    updateSubscriptionInfo,
    disableSubscriptionInfo,
    data: { subscription }
}) => {
    const defaultAsset = config.priceAssets[0].address;
    const [asset, setAsset] = useState(defaultAsset);
    const [amount, setAmount] = useState("");
    const [actualAmount, setActualAmount] = useState("");
    const [days, setDays] = useState("");

    useEffect(() => {
        getSubscriptionInfo();
    }, []);
    useEffect(() => {
        if (subscription && subscription.isEnabled) {
            setAsset(subscription.tokenAddress);
            setAmount(subscription.amountPerDay / 10 ** 18);
            setDays(subscription.minDurationInDays);
        }
    }, [subscription]);

    return (
        <div className="updateSubscriptionInfo">
            {subscription && (
                <>
                    <span className="profileTitle">
                        Update Subscription Info
                    </span>
                    <p>
                        {`Subscription: 
                        ${subscription.isEnabled ? "Enabled" : "Disabled"}`}
                    </p>
                    {subscription.isEnabled && (
                        <>
                            <span>
                                {`Token: 
                                ${getTokenSymbol(subscription.tokenAddress)}`}
                            </span>
                            <span>
                                {`Min Days: ${subscription.minDurationInDays}`}
                            </span>
                            <span>
                                {`Amount Per Day: ${(
                                    Number(subscription.amountPerDay) /
                                    10 ** 18
                                ).toFixed(2)} ${getTokenSymbol(asset)} (${
                                    subscription.amountPerDay
                                })`}
                            </span>
                        </>
                    )}

                    <label htmlFor="days" className="subscriptionLabel">
                        Minimum Days
                    </label>
                    <input
                        className="subscriptionInput"
                        id="days"
                        type="number"
                        placeholder=""
                        value={days}
                        onChange={e => setDays(e.target.value)}
                    />
                    <label htmlFor="amountInput" className="subscriptionLabel">
                        Amount Per Day
                    </label>
                    <div className="amountInput">
                        <input
                            id="amountInput"
                            className="subscriptionInput"
                            type="number"
                            placeholder=""
                            value={amount}
                            onChange={e => {
                                setAmount(e.target.value);
                                let actualAmount =
                                    BigInt(e.target.value) * BigInt(10 ** 18);
                                actualAmount = actualAmount / BigInt(86400);
                                actualAmount = actualAmount * BigInt(86400);
                                window.amount = actualAmount;
                                setActualAmount(actualAmount);
                            }}
                        />
                        <select
                            className="assetInput"
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
                    </div>
                    <p>
                        {`Actual Amount: ${(
                            Number(actualAmount) /
                            10 ** 18
                        ).toFixed(2)} ${getTokenSymbol(
                            asset
                        )} (${actualAmount})`}
                    </p>

                    <a
                        className="subscriptionButton button"
                        onClick={e => {
                            updateSubscriptionInfo(actualAmount, days, asset);
                        }}
                    >
                        Update Subscription Info
                    </a>
                    {subscription.isEnabled && (
                        <a
                            className="subscriptionButton button"
                            onClick={e => {
                                disableSubscriptionInfo();
                            }}
                        >
                            Disable Subscriptions
                        </a>
                    )}
                </>
            )}
        </div>
    );
};

function mapState(state) {
    const { data } = state.user;
    return { data };
}

const actionCreators = {
    getSubscriptionInfo: userActions.getSubscriptionInfo,
    updateSubscriptionInfo: userActions.updateSubscriptionInfo,
    disableSubscriptionInfo: userActions.disableSubscriptionInfo
};

const connectedUpdateSubscription = connect(
    mapState,
    actionCreators
)(UpdateSubscription);

export default connectedUpdateSubscription;
