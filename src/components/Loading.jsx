import loading from "../assets/img/loading.svg";
import React from "react";

const Loading = () => (
    <div className="suspense">
        <img className="loading" src={loading} />
    </div>
);

export default Loading;
