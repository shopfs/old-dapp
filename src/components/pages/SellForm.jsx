import React, { useState } from "react";
import { connect } from "react-redux";
import { daemonActions, contractActions } from "../../actions";

const SellForm = ({ sell, afterSubmit, uploadFile }) => {
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");
    const [price, setPrice] = useState("");

    const sellFile = async () => {
        const fileDaemonPayload = await uploadFile(path)
        console.log(fileDaemonPayload)
        // the thread info and bucket name needs to be stored on firebase with seller address as the key
        await sell(price, fileDaemonPayload.uploadData, description);
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
			//Button is not valid 
            /*<Button>
                Upload a file
            </Button>*/
            <input type="file"
             onChange={e => setFile(event.target.files[0])}
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
