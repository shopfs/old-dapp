import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";
import FilesDisplay from "./FilesDisplay";
import SellForm from "./SellForm";
import ThreadTest from "./ThreadTest";
import "../../assets/scss/sellPage.scss";

const SellPage = ({ data: { allFiles, buyerFiles }, connected, getAllFiles, getBuyerFiles }) => {
    useEffect(() => {
        if (connected) {
            getAllFiles();
            // getBuyerFiles();
        }
    }, [connected]);

    return (
        <div className="homePage">
            <div className="homePageInner">
                {connected && (
                    <>
                        <FilesDisplay allFiles={allFiles} buyerFiles={buyerFiles} />
                        <div>
                            <SellForm afterSubmit={getAllFiles} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

function mapState(state) {
    const { connected } = state.web3;
    const { data } = state.user;
    return { data, connected };
}

const actionCreators = {
    getAllFiles: userActions.getAllFiles,
    getBuyerFiles: userActions.getBuyerFiles
};

const connectedSellPage = connect(mapState, actionCreators)(SellPage);
export default connectedSellPage;
