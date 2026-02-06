import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

actor {
  func principalToString(p : Principal) : Text {
    p.toText();
  };

  let persistentSet = Set.empty<Principal>();

  public func addPersistentCanister(id : Principal) : async () {
    persistentSet.add(id);
  };

  public query func getPersistentCanisters() : async [Text] {
    persistentSet.values().map(principalToString).toArray();
  };

  func remotePrincipalToText(p : Principal) : Text {
    p.toText();
  };

  var remoteSet = Set.empty<Principal>();

  public func addRemoteCanister(id : Principal) : async () {
    remoteSet.add(id);
  };

  public query func getRemoteCanisters() : async [Text] {
    remoteSet.values().map(remotePrincipalToText).toArray();
  };

  var externalTextSet = Set.empty<Text>();

  public func addExternalText(text : Text) : async () {
    externalTextSet.add(text);
  };

  public query func getExternalTexts() : async [Text] {
    externalTextSet.toArray();
  };
};
