import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";

const SellForm = ({ sell, afterSubmit, uploadAndSellFile, uploadImage }) => {
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");
    const [price, setPrice] = useState("");
    const [imgHash, setImgHash] = useState(null);

    const sellFile = async () => {
        await uploadAuploadAndSellFilendSellFile(path, description, imageHash, price);
        afterSubmit();
        setPath("");
        setPrice("");
        setDescription("");
    };

    const uploadFile = async file => {
        console.log("file uploading to ipfs");
        const fileHash = await uploadImage(file);
        console.log("file upload done: ", fileHash);
        setImgHash(fileHash);
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
            {imgHash && (
                <img
                    className="file-img"
                    src={`https://ipfs.infura.io/ipfs/${imgHash}`}
                />
            )}
            <input
                type="file"
                onChange={e => {
                    const file = e.target.files[0];
                    uploadFile(file);
                }}
                accept="image/*"
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
    uploadAndSellFile: userActions.uploadAndSellFile,
    uploadImage: userActions.uploadImage
};

const connectedSellForm = connect(mapState, actionCreators)(SellForm);

export default connectedSellForm;
