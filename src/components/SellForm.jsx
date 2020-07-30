import React, { useEffect, useState } from "react";
import config from "config";
import { connect } from "react-redux";
import { userActions } from "../actions";
import loading from "../assets/img/loading.svg";
import "../assets/scss/sellForm.scss";

const SellForm = ({ sell, uploadAndSellFile, uploadImage, inProgress }) => {
    const defaultImage =
        "bafybeihlhbf7oe34dbimsira2c6kezinpcnlt76fud22bv3kupsv4xkfru";
    const defaultAsset = config.priceAssets[0].address;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [path, setPath] = useState("");
    const [price, setPrice] = useState("");
    const [asset, setAsset] = useState(defaultAsset);
    const [imageHash, setImageHash] = useState(defaultImage);

    const sellFile = async () => {
        const metadata = {
            title,
            description,
            imageHash
        };
        try {
            await uploadAndSellFile(path, metadata, price, asset);
            setTitle("");
            setDescription("");
            // setImageHash(defaultImage);
            setPath("");
            setPrice("");
            setAsset(defaultAsset);
        } catch (error) {
            console.log({ sellError: error });
        }
    };

    const uploadFile = async file => {
        console.log("file uploading to ipfs");
        const fileHash = await uploadImage(file);
        console.log("file upload done: ", fileHash);
        setImageHash(fileHash);
    };

    return (
        <main className="sellForm">
            <section>
                <label htmlFor="titleInput" className="titleLabel label">
                    Title
                </label>
                <input
                    id="titleInput"
                    type="text"
                    placeholder=""
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </section>
            <section>
                <label
                    htmlFor="descriptionInput"
                    className="descriptionLabel label"
                >
                    Description
                </label>
                <input
                    id="descriptionInput"
                    type="multitext"
                    placeholder=""
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </section>
            <section>
                <label htmlFor="imageInput" className="imageLabel label">
                    Display image
                </label>
                {imageHash && (
                    <img
                        className="file-image"
                        src={`https://ipfs.infura.io/ipfs/${imageHash}`}
                    />
                )}
                <label className="button">
                    Choose image
                    <input
                        id="imageInput"
                        type="file"
                        style={{ display: "none" }}
                        onChange={e => {
                            console.log("test")
                            const file = e.target.files[0];
                            uploadFile(file);
                        }}
                        accept="image/*"
                    />
                </label>
            </section>
            <section>
                <label htmlFor="pathInput" className="pathLabel label">
                    Local file path
                </label>
                <input
                    id="pathInput"
                    type="text"
                    placeholder=""
                    value={path}
                    onChange={e => setPath(e.target.value)}
                />
            </section>

            <section>
                <label htmlFor="priceInput" className="pathLabel label">
                    Price
                </label>
                <div className="priceInput">
                    <input
                        id="priceInput"
                        type="number"
                        placeholder=""
                        value={price}
                        onChange={e => setPrice(e.target.value)}
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
            </section>
            <div className="sellSubmit">
                <a
                    className="sellButton button"
                    onClick={e => {
                        sellFile();
                    }}
                >
                    Upload File
                </a>
                <img
                    className="loading"
                    src={loading}
                    style={
                        inProgress ? { display: "block" } : { display: "none" }
                    }
                />
            </div>
        </main>
    );
};

function mapState(state) {
    const { inProgress } = state.user;
    return { inProgress };
}

const actionCreators = {
    uploadAndSellFile: userActions.uploadAndSellFile,
    uploadImage: userActions.uploadImage
};

const connectedSellForm = connect(mapState, actionCreators)(SellForm);

export default connectedSellForm;
