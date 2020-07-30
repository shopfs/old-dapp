import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "../assets/scss/homePage.scss";
import upload from "../assets/img/upload.svg";
import details from "../assets/img/details.svg";
import ethereum from "../assets/img/ethereum.svg";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homePage">
                <div className="welcome">
                    <span className="welcomeTitle"> Welcome To ShopFS </span>
                    <span className="welcomeSubtitle">
                        ShopFS helps creators monetize their files
                    </span>
                </div>
                <div className="howItWorks">
                    <div className="innerBox">
                        <img className="boxImage" src={upload} />
                        <span className="boxTitle">Upload file</span>
                        <span className="boxDescription">
                            Your files are encrypted and stored securely on IPFS
                        </span>
                    </div>
                    <div className="innerBox">
                        <img className="boxImage" src={details} />
                        <span className="boxTitle">Describe file</span>
                        <span className="boxDescription">
                            You can upload any type of file such as music,
                            video, images or text
                        </span>
                    </div>
                    <div className="innerBox">
                        <img className="boxImage" src={ethereum} />
                        <span className="boxTitle">Earn fees</span>
                        <span className="boxDescription">
                            You can price your files using any ERC20 token
                        </span>
                    </div>
                </div>
                <div className="joinNow">
                    <span className="joinNowText">
                        Join now, explore files on the decentralized web
                    </span>
                    <Link className="exploreFilesButton button" to="/files">
                        Explore files
                    </Link>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export default connectedHomePage;
