import React, { useState}  from "react";
import config from "config";
import { connect } from "react-redux";
import { userActions } from "../actions";
import { useQuery } from "urql";
import { sellerSubscriptionInfoQuery } from "../helpers/graph";

function Subscribe(props) {
  const { createSubscription,address,cancelSubscription } = props;
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const defaultAsset = config.priceAssets[0].address;
  const [asset, setAsset] = useState(defaultAsset);
   
  const query = sellerSubscriptionInfoQuery(address);
  const [res, executeQuery] = useQuery({
        query: query
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
        <h1>Subscribe</h1>	
		
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
    
    </>
  );
}
export default Subscribe;