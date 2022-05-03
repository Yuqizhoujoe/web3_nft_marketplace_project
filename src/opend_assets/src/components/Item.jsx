import React, { useEffect, useState } from "react";
import { textSpanContainsPosition } from "../../../../node_modules/typescript/lib/typescript";
import useNft from "../hooks/useNft";
import Button from "./Button";

function Item({ NFTID }) {
  const { name, owner, resource, getNft } = useNft();

  const [price, setPrice] = useState('');
  const [selling, setSelling] = useState(false);

  useEffect(() => {
    getNft("images/png", NFTID);
  }, [NFTID]);

  const sellNFTButtonHandler = () => {
    setSelling(true);
  };

  const confirmSellNFTButtonHandler = () => {
    setSelling(false);
    console.log(price);
  }

  const priceInputChangeHandler = (e) => {
    e.preventDefault();
    setPrice(e.target.value);
  };

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={resource}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}
            <span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          <input
            placeholder="$$$$ in JOJO"
            type="number"
            className="price-input"
            value={price}
            onChange={priceInputChangeHandler}
            hidden={!selling}
          />
          {!selling && <Button handleClick={sellNFTButtonHandler} text="Sell" />}
          {selling && <Button handleClick={confirmSellNFTButtonHandler} text="Confirmed" />}
        </div>
      </div>
    </div>
  );
}

export default Item;
