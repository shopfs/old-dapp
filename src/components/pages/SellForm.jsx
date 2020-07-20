import React, { useState } from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";

const SellForm = ({ sell, afterSubmit, uploadAndSellFile }) => {
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");
    const [price, setPrice] = useState("");

    const sellFile = async () => {
        // const fileDaemonPayload = await uploadFile(path)
        // console.log(fileDaemonPayload)
        // // the thread info and bucket name needs to be stored on firebase with seller address as the key
        // await sell(price, fileDaemonPayload, uploadData, description);

        await uploadAndSellFile(path, description, price);
        afterSubmit();
        setPath("");
        setPrice("");
        setDescription("");
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
    uploadAndSellFile: userActions.uploadAndSellFile
};

const connectedSellForm = connect(mapState, actionCreators)(SellForm);

export default connectedSellForm;
