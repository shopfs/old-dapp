import React, { useState}  from "react";
import config from "config";
import { connect } from "react-redux";
import { userActions } from "../actions";

function Modal(props) {
  const { show, closeModal,createSubscription,address,cancelSubscription } = props;
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const defaultAsset = config.priceAssets[0].address;
  const [asset, setAsset] = useState(defaultAsset);
  
  const createSub = async () => {
	  const createsubresult = await createSubscription(amount,asset,days,address);
	  console.log(createsubresult);
  }
  
  const cancelSub = async () => {
	  const cancelsubresult = await cancelSubscription(address);
	  console.log(cancelsubresult);
  }
  
  return (
    <>
	  <div className={show ? "overlay" : "hide"} onClick={closeModal} />
      <div className={show ? "modal" : "hide"}>        
	    <button onClick={closeModal}>X</button>
        <h1>Suscribe Modal</h1>
		
		<section>
		        <label >
                    amount
                </label>
                    <input
                        id="amountInput"
                        type="number"
                        placeholder=""
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
				<label >
                    numofdays
                </label>
                    <input
                        id="daysInput"
                        type="number"
                        placeholder=""
                        value={days}
                        onChange={e => setDays(e.target.value)}
                    />
					<select
                        className="assetInput"
                        onChange={e => {
                            setAsset(e.target.value);
                            console.log(e.target.value);
                        }}
                        value={asset}
                    >
                        {config.priceAssets &&
                            config.priceAssets.map((asset, index) => (
                                <option value={asset.address} key={index}>
                                    {asset.symbol}
                                </option>
                            ))}
                    </select>
					<button onClick={e => {
                        createSub();
                    }}>createsubscription</button>
					<button onClick={e => {
                        cancelSub();
                    }}>cancelsubscription</button>
		</section>       
      </div>
    </>
  );
}
export default Modal;