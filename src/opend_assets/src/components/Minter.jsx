import React, {useState} from "react";
import Item from "./Item";
import { useForm } from "react-hook-form";

import { opend } from "../../../declarations/opend";

function Minter() {
  const { register, handleSubmit } = useForm();
const [nftPrincipal, setNftPrincipal] = useState("");

  async function onSubmit(formData) {
    const {name, image} = formData;
    const imageData = image[0];
    const imageBufferArray = await imageData.arrayBuffer();
    const imageByteData = [...new Uint8Array(imageBufferArray)];
    
    const newNFTID = await opend.mint(imageByteData, name);
    setNftPrincipal(newNFTID);
  }

  if (nftPrincipal !== "") {
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item NFTID={nftPrincipal.toText()} />
        </div>
      </div>
    );
  } 

  return (
    <div className="minter-container">
      <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
        Create NFT
      </h3>
      <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
        Upload Image
      </h6>
      <form className="makeStyles-form-109" noValidate="" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="upload-container">
          <input
            {...register("image", {required: true})}
            className="upload"
            type="file"
            accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
          />
        </div>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Collection Name
        </h6>
        <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
          <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
            <input
              {...register("name", { required: true })}
              placeholder="e.g. CryptoDunks"
              type="text"
              className="form-InputBase-input form-OutlinedInput-input"
            />
            <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
          </div>
        </div>
        <button type="submit" className="form-Chip-label">
          Mint NFT
        </button>
      </form>
    </div>
  );
}

export default Minter;
