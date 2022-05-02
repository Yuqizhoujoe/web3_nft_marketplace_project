import React, {useState, useEffect} from "react";
import useNft from "../hooks/useNft";
import Item from "./Item";

function Gallery({title, ids}) {
  const [items, setItems] = useState();

  useEffect(() => {
    if (ids) {
      setItems(
        ids.map(NFTID => <Item NFTID={NFTID} key={NFTID.toText()} />)
      );
    }
  }, [ids]);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
          {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
