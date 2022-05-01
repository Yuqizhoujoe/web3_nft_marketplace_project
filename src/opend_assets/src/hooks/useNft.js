import {useReducer, useCallback} from "react";
import { SET_NFT } from './actions';

import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";

const localHost = "http://localhost:8080/";
const agent = new HttpAgent({
  host: localHost,
});

const initialData = {
    name: '',
    owner: '',
    resource: ''
};

const nftReducer = (state, action) => {
    switch (action.type) {
        case SET_NFT: 
            return {
                ...state,
                name: action.name,
                owner: action.owner,
                resource: action.resource
            };
        default:
            return {...state};
    }
};

const useNft = () => {
    const [state, dispatch] = useReducer(nftReducer, initialData);

    const getNft = useCallback(async (imageType, NFTID) => {
        const NFTActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: Principal.fromText(NFTID),
        });

        const name = await NFTActor.getName();
        const owner = await NFTActor.getOwner();
        const parseOwner = owner.toText();
        const resource = await NFTActor.getAsset();
        const imageContent = new Uint8Array(resource);
        const image = URL.createObjectURL(
            new Blob([imageContent.buffer], { type: imageType })
        );
        dispatch({
            type: SET_NFT,
            name,
            owner: parseOwner,
            resource: image
        });
    }, []);

    return {
        name: state.name,
        resource: state.resource,
        owner: state.owner,
        getNft
    };
};

export default useNft;

