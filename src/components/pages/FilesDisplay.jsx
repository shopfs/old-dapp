import React, { useState } from "react";
import { connect } from "react-redux";
import { contractActions } from "../../actions";
import Modal from './Modal';
import "./styles.css";


const FilesDisplay = ({ buy, allFiles }) => {
	const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);
    return (
        <section className="filesDisplay">
            {allFiles &&
                allFiles.map((file, fileId) => (
                    <div className="fileItem" key={file.hash}>
                        <p> Description: {file.description} </p>
                        <p> Hash: {file.hash} </p>
                        <p> Retrievals: {file.numRetriveals} </p>
                        <p> Price: {file.price + " DAI"} </p>
						{!show && <button
                            onClick={openModal
								//async e => {
                                //await buy(fileId);
					            //}
							}
                        >
                            Buy File
                        </button>
						}
						/*{!show && <button onClick={openModal}>Show modal</button>}
						*/
						<Modal closeModal={closeModal} show={show} />
                    </div>
                ))}
        </section>
    );
};

function mapState(state) {
    return {};
}

const actionCreators = {
    buy: contractActions.buy
};

const connectedFilesDisplay = connect(mapState, actionCreators)(FilesDisplay);

export default connectedFilesDisplay;
