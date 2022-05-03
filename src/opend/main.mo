import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import NFTActorClass "../NFT/nft";

actor OpenD {

    private type Listing = {
        itemOwner: Principal;
        itemPrice: Nat;
    };

    /*
     mapOfNFTs: {
         NFT Principal ID: NFT // each NFT saved in a canister
     }
    */
    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    /*
    mapOfOwners: {
        owner principal id: [NFT_ID] 
    } 
    */
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);


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

        let ownedNftsIter = Iter.fromList(ownedNfts);

        for (ownedNft in ownedNftsIter) {
            if (Principal.equal(ownedNft, nftId)) {
                return;
            };
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

    public shared(msg) func listItem(id: Principal, price: Nat): async Text {
        var item : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
            case null return "NFT does not exist.";
            case (?result) result;
        };

        let owner = await item.getOwner();
        if (Principal.notEqual(owner, msg.caller)) {
            return "You don't own the NFT";
        };

        let newListing: Listing = {
            itemOwner = owner;
            itemPrice = price
        };
        mapOfListings.put(id, newListing);

        return "Success";
    };
}