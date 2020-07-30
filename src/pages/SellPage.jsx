import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userActions } from "../actions";
import SellForm from "../components/SellForm";
import "../assets/scss/sellPage.scss";

const SellPage = ({
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
        <div className="sellPage">
            {connected && <SellForm afterSubmit={getAllFiles} />}
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
const connectedSellPage = connect(mapState, actionCreators)(SellPage);
export default connectedSellPage;
