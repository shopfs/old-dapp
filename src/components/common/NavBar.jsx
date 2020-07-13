import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { web3Actions, boxActions } from "../../actions";
import loading from "../../assets/img/loading.gif";
import "../../assets/scss/navBar.scss";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: this.props.location.pathname
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.location.pathname !== state.pathname) {
            return {
                pathname: props.location.pathname
            };
        }
        return null;
    }

    render() {
        const { inProgress, account, connected } = this.props;
        return (
            <div className="navBarContainer">
                <img
                    className="loading"
                    src={loading}
                    style={inProgress ? { opacity: 1 } : { opacity: 0 }}
                />
                <div className="navBarLogo">ETH + IPFS Market</div>
                <div className="navBarAddress">
                    {connected ? (
                        "Logged in as " + account
                    ) : (
                        <div
                            className="connect"
                            onClick={() => {
                                this.props.loadWeb3();
								this.props.loadbox(this.props.account);
								console.log(this.props.account);
                            }}
                        >
                            Connect with Metamask
                        </div>
                    )}
                </div>
				<button onClick={() => {
                                this.props.loadbox(this.props.account);
								console.log(account);
                            }}>3box</button>
            </div>
        );
    }
}
function mapState(state) {
    const { account, connected } = state.web3;
	const { loggedIn } = state.box;
    const inProgress =
        state.contract.inProgress ||
		state.box.inProgress ||
        state.web3.inProgress;
    return { inProgress, account, connected, loggedIn };
}

const actionCreators = {
    loadWeb3: web3Actions.loadWeb3,
	loadbox: boxActions.loadbox
};

const connectedNavBar = withRouter(connect(mapState, actionCreators)(NavBar));
export { connectedNavBar as NavBar };
