import React from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";

const FilesDisplay = ({ buy, allFiles, buyerFiles, downloadFile }) => {
    return (
        <section className="filesDisplay">
            {allFiles &&
                allFiles.map((file, fileId) => (
                    <div className="fileItem" key={file.metadataHash}>
                        <p> Description: {file.metadata.description} </p>
                        <p> FileName: {file.metadata.fileName} </p>
                        <p> BucketName: {file.metadata.bucketName} </p>
                        <p> ImageHash: {file.metadata.imageHash} </p>
                        <p> Hash: {file.metadataHash} </p>
                        <p> Retrievals: {file.numRetriveals} </p>
                        <p> Price: {file.price + " DAI"} </p>
                        <button
                            onClick={async e => {
                                await buy(fileId);
                            }}
                        >
                            Buy File
                        </button>
                        {/* buyerFiles && buyerFiles.includes(fileId) && (
                        )*/}
                        <button
                            onClick={async e => {
                                await downloadFile(file.metadataHash);
                            }}
                        >
                            Download File
                        </button>
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
