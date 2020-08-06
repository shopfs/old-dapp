import React, { useState, useRef } from "react";
import config from "config";
import { connect } from "react-redux";
import { userActions } from "../actions";
import Loading from "../components/Loading";
import "../assets/scss/subscribeModal.scss";
import { getTokenSymbol } from "../helpers";

const SubscribeModal = ({
    createSubscription,
    cancelSubscription,
    seller,
    subscription,
    close
}) => {
    const modalRef = useRef(null);
    const [days, setDays] = useState(0);
    const [amount, setAmount] = useState(0);

    return (
        <div
            className="subscribeModal"
            onClick={e => {
                if (!modalRef.current.contains(e.target)) {
                    close();
                }
            }}
        >
            <div className="subscribeModalInner" ref={modalRef}>
                <div
                    className="closeButton"
                    onClick={() => {
                        close();
                    }}
                >
                    {"×"}
                </div>
                <span className="modalTitle">
                    {subscription ? "Subscription" : "Subscribe"}
                </span>
                {!subscription && seller.isEnabled && (
                    <>
                        <label htmlFor="days" className="modalLabel">
                            Number Of Days
                        </label>
                        <input
                            className="modalInput"
                            id="days"
                            type="number"
                            placeholder=""
                            value={days}
                            onChange={e => {
                                setDays(parseInt(e.target.value));
                                if (e.target.value) {
                                    setAmount(
                                        BigInt(
                                            BigInt(seller.amountPerDay) * BigInt(e.target.value)
                                        )
                                    );
                                }
                            }}
                        />
                        <p>{`Min Number of Days: ${seller.minDurationInDays}`}</p>
                        <p>{`Amount per Day: ${seller.amountPerDay}`}</p>
                        <p>
                            {`Total Amount: ${(
                                Number(amount) /
                                10 ** 18
                            ).toFixed(2)} ${getTokenSymbol(
                                seller.tokenAddress
                            )} (${amount})`}
                        </p>

                        <a
                            className="button"
                            onClick={async e => {
                                if (
                                    Number(days) >=
                                    Number(seller.minDurationInDays)
                                ) {
                                    createSubscription(
                                        amount,
                                        seller.tokenAddress,
                                        days,
                                        seller.address
                                    );

                                    close();
                                }
                            }}
                        >
                            Create Subscription
                        </a>
                    </>
                )}
                {!subscription && !seller.isEnabled && (
                    <p> User has not enabled subscriptions </p>
                )}
                {subscription && (
                    <a
                        className="button"
                        onClick={async e => {
                            cancelSubscription(seller.address);
                            close();
                        }}
                    >
                        Cancel Subscription
                    </a>
                )}
            </div>
        </div>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    createSubscription: userActions.createSubscription,
    cancelSubscription: userActions.cancelSubscription
};

const connectedSubscribeModal = connect(
    mapState,
    actionCreators
)(SubscribeModal);

export default connectedSubscribeModal;
