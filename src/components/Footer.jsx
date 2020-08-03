import React from "react";
import "../assets/scss/footer.scss";

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footerContainer">
                <span className="copyright">{`\u00a9 shopFS 2020`}</span>
            </div>
        );
    }
}


export default Footer;
