import React from "react";
import { connect } from "react-redux";
import { contractActions } from "../../actions";
import FilesDisplay from "./FilesDisplay";
import SellForm from "./SellForm";
import ThreadTest from "./ThreadTest";
import "../../assets/scss/homePage.scss";

class HomePage extends React.Component {
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
                    <div> Welcome To IPFS-Marketplace </div>
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

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export default connectedHomePage;