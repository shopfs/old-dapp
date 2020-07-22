import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";
import FilesDisplay from "./FilesDisplay";
import SellForm from "./SellForm";
import ThreadTest from "./ThreadTest";
import Tabs from "./Tabs";
import "../../assets/scss/sellPage.scss";
import { history } from "../../helpers";

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
        <div className="homePage">
            <div className="homePageInner">
                {connected && (
                    <>
                        <Tabs>
                            <div label="Buyer">
                                <FilesDisplay allFiles={allFiles} />
                            </div>
                            <div label="Seller">
                                <SellForm afterSubmit={getAllFiles} />
                            </div>
                        </Tabs>
					<button
                            /*onClick={e => {
                                buy(fileId);
                            }}*/
							onClick={() => history.push("/details")}
                        >
                            details page test
                        </button>	
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
    getAllFiles: userActions.getAllFiles
};

const connectedSellPage = connect(mapState, actionCreators)(SellPage);
export default connectedSellPage;
