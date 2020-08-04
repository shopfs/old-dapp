import React, { useState}  from "react";
import config from "config";
import { connect } from "react-redux";

const UpdateSubscription = ({ enablesubscription,disablesubscription }) => {
  const defaultAsset = config.priceAssets[0].address;
  const [asset, setAsset] = useState(defaultAsset);
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  
  const enableSub = async() => {
	  const enableresult = await updateSubscriptionInfo(amount,days,asset);
	  console.log(enableresult);
  }
  
  const disableSub = async () => {
	  const disablesubresult = await disableSubscriptionInfo();
	  console.log(disablesubresult);
  }
  
  
  return (
    <>
        <h1>WIP</h1>
		
		
		
		<label >
                    amount
        </label>
		<input
                        id="daysInput"
                        type="number"
                        placeholder=""
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
		<label >
                    mindays
        </label>
		<input
                        id="daysInput"
                        type="number"
                        placeholder=""
                        value={days}
                        onChange={e => setDays(e.target.value)}
		/>			
        <label >
                    asset
        </label>
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
                        enableSub();
	   }}>enable subs</button>	
       <button onClick={e => {
                        disableSub();
	   }}>disable subs</button>		
		   
    </>
  );
}
export default UpdateSubscription;