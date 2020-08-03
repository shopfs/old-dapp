import React, { useState}  from "react";
import config from "config";
import { connect } from "react-redux";
import { userActions } from "../actions";
import { useQuery } from "urql";

function Modal(props) {
  const { show, closeModal,createSubscription,address,cancelSubscription } = props;
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const defaultAsset = config.priceAssets[0].address;
  const [asset, setAsset] = useState(defaultAsset);
  
  const [res, executeQuery] = useQuery({
        query: `
        query {
          user(id: "${address.toLowerCase()}") {
            id
            address
            isEnabled
            minDurationInDays
			amountPerDay
			tokenAddress           
          }
        }
      `
    });
  
  if (res.fetching) return <p>Loading...</p>;
  if (res.error) return <p>Errored!</p>;
  let user = res.data.user;
  
  const createSub = async () => {
	  const useramt = user.amountPerDay;
	  const totalamt = useramt*days;
	  
	  if(user.isEnabled == true){
      console.log(user);
	  //const testamt = 10000000000000;
	  const createsubresult = await createSubscription(totalamt,user.tokenAddress,days,user.address);
	  console.log(createsubresult);
	  } else if (user.isEnabled == false) {
	  console.log("do something");
	  } else {
	  console.log("query failed");
	  }
  }
  
  const cancelSub = async () => {
	  const cancelsubresult = await cancelSubscription(user.address);
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
                    numofdays
                </label>
                    <input
                        id="daysInput"
                        type="number"
                        placeholder=""
                        value={days}
                        onChange={e => setDays(e.target.value)}
                    />
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