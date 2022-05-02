import React, {useState, useEffect} from "react";
import logo from "../../assets/logo.png";
import homeImage from "../../assets/home-img.png";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import useNft from "../hooks/useNft";

function Header() {
  const [userOwnedGallery, setUserOwnedGallery] = useState();

  const {
    getNftIds
  } = useNft();

  useEffect(() => {
    const buildNFTGallery = (nftIds) => {
      setUserOwnedGallery(<Gallery title="My NFTs" ids={nftIds} />);
    };
    getNftIds(buildNFTGallery);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <Link to="/">
              <h5 className="Typography-root header-logo-text">JoJo</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Switch>
        <Route path="/discover">
          <h1>Discover</h1>
        </Route>
        <Route path="/minter">
          <Minter />
        </Route>
        <Route path="/collection">
          {userOwnedGallery}
        </Route>
        <Route path="/">
          <img className="bottom-space" src={homeImage} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
