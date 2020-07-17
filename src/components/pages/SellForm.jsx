import React, { useState } from "react";
import { connect } from "react-redux";
import { daemonActions, contractActions } from "../../actions";

const SellForm = ({ sell, afterSubmit, uploadFile }) => {
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");
    const [price, setPrice] = useState("");

    const sellFile = async () => {
        const threadInfo = await uploadFile(path)
        console.log(threadInfo)
        // await sell(price, hash, description);
        // afterSubmit();
        // setPath("");
        // setPrice("");
        // setDescription("");
    };

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
                placeholder="full file path"
                value={path}
                onChange={e => setPath(e.target.value)}
            />
            <input
                type="number"
                placeholder="price in DAI"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <button
                onClick={e => {
                    sellFile();
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
    sell: contractActions.sell,
    uploadFile: daemonActions.uploadFile
};

const connectedSellForm = connect(mapState, actionCreators)(SellForm);

export default connectedSellForm;
