import React from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";
import FilesDisplay from "./FilesDisplay";
import SellForm from "./SellForm";
import ThreadTest from "./ThreadTest";
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
                    <FilesDisplay allFiles={allFiles} />
                    <div>
                        <SellForm afterSubmit={this.refresh} />
                        {/* <ThreadTest /> */}
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { data } = state.user;
    return { data };
}

const actionCreators = {
    getAllFiles: userActions.getAllFiles
};

const connectedSellPage = connect(mapState, actionCreators)(SellPage);
export default connectedSellPage;
