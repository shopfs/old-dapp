import React, { useState } from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";
import Modal from "./Modal";
import "./styles.css";

const FilesDisplay = ({ buy, allFiles, downloadFile }) => {
    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);
    return (
        <section className="filesDisplay">
            {allFiles &&
                allFiles.map((file, fileId) => (
                    <div className="fileItem" key={file.metadataHash}>
                        <p> Description: {file.metadata.description} </p>
                        <p> FileName: {file.metadata.fileName} </p>
                        <p> BucketName: {file.metadata.bucketName} </p>
                        {file.metadata.imageHash && (
                            <>
                                <p> ImageHash: {file.metadata.imageHash} </p>
                                <img
                                    className="file-img"
                                    src={`https://ipfs.infura.io/ipfs/${file.metadata.imageHash}`}
                                />
                            </>
                        )}
                        <p> Hash: {file.metadataHash} </p>
                        <p> Retrievals: {file.numRetriveals} </p>
                        <p> Price: {file.price + " DAI"} </p>
                        <button
                            onClick={e => {
                                buy(fileId);
                            }}
                        >
                            Buy File
                        </button>
                        <button
                            onClick={async e => {
                                await downloadFile(file.metadataHash);
                            }}
                        >
                            Download File
                        </button>
                        <button onClick={openModal}>Show modal</button>
                        <Modal closeModal={closeModal} show={show} />
                    </div>
                ))}
        </section>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    buy: userActions.buy,
    downloadFile: userActions.downloadFile
};

const connectedFilesDisplay = connect(mapState, actionCreators)(FilesDisplay);

export default connectedFilesDisplay;