import React from "react";
import { connect } from "react-redux";
import { userActions } from "../../actions";
import { history } from "../../helpers";


const DetailsPage = ({ buy,File }) => {
  
  //details file for details of single file
  return (
    <section className="filedetails">
	  <div>welcome to detailspage,what should go here?</div>
	  {  
		file && (
		<div className="oneFile">
		<p> Description: {file.metadata.description} </p>
        <p> FileName: {file.metadata.fileName} </p>
        <p> BucketName: {file.metadata.bucketName} </p>
		{file.metadata.imageHash && (
                            <>
                                <p> ImageHash: {file.metadata.imageHash} </p>
                                <img
                                    className="file-img"
                                    src={`https://ipfs.infura.io/ipfs/${file.metadata.imageHash}`}
                                />
                            </>
                        )}
        <p> Hash: {file.metadataHash} </p>
        <p> Retrievals: {file.numRetriveals} </p>
        <p> Price: {file.price + " DAI"} </p>
		<button
            onClick={e => {
                buy(fileId);
                }}
        >
        Buy File
        </button>
		<button
            onClick={async e => {
            await downloadFile(file.metadataHash);
            }}
        >
        Download File
        </button>
		</div>
	  )}
    </section>
  );
}

export default DetailsPage;