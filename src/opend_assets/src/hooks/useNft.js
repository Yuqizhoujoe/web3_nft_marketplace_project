import { useReducer, useCallback } from "react";
import { FETCH_NFT, FETCH_NFTS, SET_NFT } from './actions';

import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";

const localHost = "http://localhost:8080/";
const agent = new HttpAgent({
    host: localHost,
});

const initialData = {
    name: '',
    owner: '',
    resource: '',
    nftIds: []
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
        case FETCH_NFTS:
            return {
                ...state,
                nftIds: [...action.nftIds]
            }
        default:
            return { ...state };
    }
};

const useNft = () => {
    const [state, dispatch] = useReducer(nftReducer, initialData);

    const getNft = useCallback(async (imageType, NFTID) => {
        if (!NFTID) {
            return;
        }

        const NFTActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: NFTID
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

    const getNftIds = useCallback(async (useNFTIds) => {
        const userNFTIds = await opend.getOwnedNfts(CURRENT_USER_ID);
        console.log('userNFTIds');
        console.log(userNFTIds);
        dispatch({
            type: FETCH_NFTS,
            nftIds: userNFTIds
        });
        useNFTIds(userNFTIds);
    }, []);

    return {
        name: state.name,
        resource: state.resource,
        owner: state.owner,
        nftIds: state.nftIds,
        getNft,
        getNftIds
    };
};

export default useNft;

