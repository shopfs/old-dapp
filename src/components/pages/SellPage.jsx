import React from "react";
import { connect } from "react-redux";
import { contractActions } from "../../actions";
import FilesDisplay from "./FilesDisplay";
import SellForm from "./SellForm";
import ThreadTest from "./ThreadTest";
import Tabs from './Tabs';
import "../../assets/scss/sellPage.scss";

class SellPage extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
    }

    async componentDidMount() {
        await this.refresh();
    }

    async refresh() {
        await this.props.getAllFiles();
    }

    render() {
        const { allFiles } = this.props.data;
        return (
            <div className="homePage">
                <div className="homePageInner">
				 <Tabs>
				    <div label="Buyer">
                        <FilesDisplay allFiles={allFiles} />
					</div>
					
                    <div label="Seller">
                        <SellForm afterSubmit={this.refresh} />
                        {/* <ThreadTest /> */}
                    </div>
					</Tabs>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { data } = state.contract;
    return { data };
}

const actionCreators = {
    getAllFiles: contractActions.getAllFiles
};

const connectedSellPage = connect(mapState, actionCreators)(SellPage);
export default connectedSellPage;