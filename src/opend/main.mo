import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import NFTActorClass "../NFT/nft";

actor OpenD {

    /*
     mapOfNFTs: {
         NFT Principal ID: NFT // each NFT saved in a canister
     }
    */
    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    /*
    mapOfOwners: {
        owner principal id: [NFT] 
    } 
    */
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);


    public shared (msg) func mint(imgData: [Nat8], name: Text): async Principal {
        Debug.print("Minted User");
        Debug.print(debug_show(msg.caller));
        let owner: Principal = msg.caller;

        Debug.print(debug_show(Cycles.balance()));
        Cycles.add(5);
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);
        Debug.print(debug_show(Cycles.balance()));

        let newNFTPrincipal = await newNFT.getCanisterId();

        mapOfNFTs.put(newNFTPrincipal, newNFT);
        addToOwnershipMap(owner, newNFTPrincipal);

        return newNFTPrincipal;
    };

    private func addToOwnershipMap(owner: Principal, nftId: Principal) {
        // mapOfOwners.get(owner) is an option it might return null 
        // using switch to deal with option in motoko
        var ownedNfts: List.List<Principal> = switch (mapOfOwners.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result
        };

        ownedNfts := List.push(nftId, ownedNfts);
        mapOfOwners.put(owner, ownedNfts);
    };

    public query func getOwnedNfts(user: Principal): async [Principal] {
        var userNFTs: List.List<Principal> = switch (mapOfOwners.get(user)) {
            case null List.nil<Principal>();
            case (?result) result
        };

        return List.toArray(userNFTs);
    };
}