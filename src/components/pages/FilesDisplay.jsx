import React from "react";
import { connect } from "react-redux";
import { contractActions } from "../../actions";

const FilesDisplay = ({ buy, allFiles }) => {
    return (
        <section className="filesDisplay">
            {allFiles &&
                allFiles.map((file, fileId) => (
                    <div className="fileItem" key={file.hash}>
                        <p> Description: {file.description} </p>
                        <p> Hash: {file.hash} </p>
                        <p> Retrievals: {file.numRetriveals} </p>
                        <p> Price: {file.price + " DAI"} </p>
                        <button
                            onClick={async e => {
                                await buy(fileId);
                            }}
                        >
                            Buy File
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
    buy: contractActions.buy
};

const connectedFilesDisplay = connect(mapState, actionCreators)(FilesDisplay);

export default connectedFilesDisplay;
