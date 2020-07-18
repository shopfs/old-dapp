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
        //this.refresh = this.refresh.bind(this);
    }

    render() {
        return (
            <div className="homePage">
                <div className="homePageInner1">
                    <div> Welcome To ShopFS </div>
                </div>
				<div className="homePageInner2">
                    <div>Sell your files directly to customers using power of blockchain and p2p storage</div>
				</div>
				<div className="homePageInner3">
                    <div className="inner-box"> img1</div>
					<div className="inner-box"> img2</div>
					<div className="inner-box"> img3</div>
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