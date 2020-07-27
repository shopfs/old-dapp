import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";
import { history } from "../../helpers";
import "../../assets/scss/detailsPage.scss";

const DetailsPage = props => {
    const fileId = props.match.params.fileId;
    useEffect(() => {
        console.log(fileId);
        props.getFile(parseInt(fileId));
    }, [fileId]);

    const file = props.data.data.file;
    //details file for details of single file
    return (
        <section className="filePage">
            <div>welcome to detailspage,what should go here?</div>
            {file && (
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
                            props.buy(fileId);
                        }}
                    >
                        Buy File
                    </button>
                    <button
                        onClick={async e => {
                            await props.downloadFile(fileId);
                        }}
                    >
                        Download File
                    </button>
                </div>
            )}
        </section>
    );
};

function mapState(state) {
    const data = state.user;
    return { data };
}

const actionCreators = {
    getFile: userActions.getFile,
    buy: userActions.buy,
    downloadFile: userActions.downloadFile
};

const connectedDetailsDisplay = connect(mapState, actionCreators)(DetailsPage);

export default connectedDetailsDisplay;
