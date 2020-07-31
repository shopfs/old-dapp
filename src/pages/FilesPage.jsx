import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userActions } from "../actions";
import FilesDisplay from "../components/FilesDisplay";
import "../assets/scss/filesPage.scss";

const FilesPage = ({
    data: { allFiles },
    connected,
    getAllFiles,
    getBuyerFiles
}) => {
    useEffect(() => {
        if (connected) {
            getAllFiles();
        }
    }, [connected]);

    return (
        <div className="filesPage">
            {connected && <FilesDisplay allFiles={allFiles} />}
        </div>
    );
};
function mapState(state) {
    const { connected } = state.web3;
    const { data } = state.user;
    return { data, connected };
}
const actionCreators = {
    getAllFiles: userActions.getAllFiles
};
const connectedFilesPage = connect(mapState, actionCreators)(FilesPage);
export default connectedFilesPage;
