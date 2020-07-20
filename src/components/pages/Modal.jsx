import React from "react";

function Modal(props) {
  const { show, closeModal } = props;
  return (
    <>
	  <div className={show ? "overlay" : "hide"} onClick={closeModal} />
      <div className={show ? "modal" : "hide"}>        
	    <button onClick={closeModal}>X</button>
        <h1>Modal heading</h1>
        <p>This is modal content</p>
      </div>
    </>
  );
}

export default Modal;