import React from "react";
import ReactDOM from "react-dom";
import { userActions } from "../actions";

function Modal(props) {
  const { show, closeModal } = props;
  return (
    <>
	  <div className={show ? "overlay" : "hide"} onClick={closeModal} />
      <div className={show ? "modal" : "hide"}>        
	    <button onClick={closeModal}>X</button>
        <h1>Suscribe Modal</h1>
		
		<section>
		
		</section>
		
        
      </div>
    </>
  );
}
export default Modal;