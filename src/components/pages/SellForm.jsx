import React, { useState } from "react";
import { connect } from "react-redux";
import { contractActions } from "../../actions";

const SellForm = ({ sell, afterSubmit }) => {
    const [description, setDescription] = useState("");
    const [hash, setHash] = useState("");
    const [price, setPrice] = useState("");

    return (
        <section className="sellForm">
            <input
                type="text"
                placeholder="file description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="file hash"
                value={hash}
                onChange={e => setHash(e.target.value)}
            />
            <input
                type="number"
                placeholder="price in DAI"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <button
                onClick={async e => {
                    await sell(price, hash, description);
                    afterSubmit();
                    setHash("");
                    setPrice("");
                    setDescription("");
                }}
            >
                Sell File
            </button>
        </section>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    sell: contractActions.sell
};

const connectedSellForm = connect(
    mapState,
    actionCreators
)(SellForm);

export default connectedSellForm;
