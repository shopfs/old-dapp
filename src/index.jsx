import React from "react";
import config from "config";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "./helpers";
import { createClient, Provider as GraphProvider } from "urql";
import App from "./App";

const client = createClient({ url: config.subgraph });

const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
        <GraphProvider value={client}>
            <App />
        </GraphProvider>
    </Provider>,
    document.getElementById("root")
);
