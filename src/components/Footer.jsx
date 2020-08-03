import React from "react";
import "../assets/scss/footer.scss";

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footerContainer">
                <span className="copyright">
                    {`\u00a9 `}
                    <a
                        style={{ color: "black" }}
                        href="https://github.com/shopfs"
                    >
                        shopFS
                    </a>
                    {` 2020`}
                </span>
            </div>
        );
    }
}

export default Footer;
