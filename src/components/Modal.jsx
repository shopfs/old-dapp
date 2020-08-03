import React from "react";
import ReactDOM from "react-dom";
import { marketService } from "../services";

function Modal(props) {
  const { show, closeModal } = props;
  return (
    <>
	  <div className={show ? "overlay" : "hide"} onClick={closeModal} />
      <div className={show ? "modal" : "hide"}>        
	    <button onClick={closeModal}>X</button>
        <h1>Suscribe Modal</h1>
		
        
      </div>
    </>
  );
}
export default Modal;