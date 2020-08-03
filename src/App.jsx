import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { history } from "./helpers";
import { web3Actions } from "./actions";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";
import "./assets/scss/app.scss";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const FilesPage = React.lazy(() => import("./pages/FilesPage"));
const DetailsPage = React.lazy(() => import("./pages/DetailsPage"));
const SellPage = React.lazy(() => import("./pages/SellPage"));
const UserPage = React.lazy(() => import("./pages/UserPage"));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.accountChanged = this.accountChanged.bind(this);
        this.networkChanged = this.networkChanged.bind(this);
    }

    async accountChanged() {
        if (this.props.web3) {
            await this.props.loadAccount();
        }
    }
    async networkChanged() {
        if (this.props.web3) {
            await this.props.loadNetwork();
        }
    }

    componentDidMount() {
        if (window.ethereum) {
            window.ethereum.autoRefreshOnNetworkChange = false;
            window.ethereum.on("accountsChanged", this.accountChanged);
            window.ethereum.on("networkChanged", this.networkChanged);
        }
    }

    render() {
        return (
            <div className="app">
                <ToastContainer autoClose={4000} />
                <Router history={history}>
                    <ErrorBoundary key={location.pathname}>
                        <React.Suspense fallback={<Loading />}>
                            <NavBar />
                            <Switch>
                                <Route exact path="/" component={HomePage} />
                                <Route
                                    exact
                                    path="/files"
                                    component={FilesPage}
                                />
                                <Route
                                    exact
                                    path="/files/:fileId"
                                    component={DetailsPage}
                                />
                                <Route
                                    exact
                                    path="/upload"
                                    component={SellPage}
                                />
                                <Route
                                    exact
                                    path="/users/:address"
                                    component={UserPage}
                                />
                                <Redirect from="*" to="/" />
                            </Switch>
                            <Footer />
                        </React.Suspense>
                    </ErrorBoundary>
                </Router>
            </div>
        );
    }
}

function mapState(state) {
    const { web3, connected } = state.web3;
    return { web3, connected };
}

const actionCreators = {
    loadAccount: web3Actions.loadAccount,
    loadNetwork: web3Actions.loadNetwork
};

const connectedApp = connect(mapState, actionCreators)(App);
export default connectedApp;
