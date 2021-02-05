var TreeModel = require("tree-model");
var tm = new TreeModel();
const uuid = require("uuid");

const isModifiedAfterSync = (v) => {
  console.log("checking last modified ", v.lastModified);
  console.log("last sync ", v.lastSynced);
  return v.lastModified > v.lastSynced;
};

const newNode = () => {
  const newId = uuid.v4();
  return { id: newId };
};

const mergeTree = (local, remote) => {
  const newId = uuid.v4();
  const newTree = tm.parse({ id: newId });
  const localString = JSON.stringify(local.model);
  const remoteString = JSON.stringify(remote.model);
  if (localString === remoteString) {
    console.log("merge with both child");
    newTree.addChild(local);
    return newTree.model;
  }
  newTree.addChild(local);
  newTree.addChild(remote);
  console.log("after merge: ", newTree.model);
  return newTree.model;
};

/**
 * @param local, remote
 * {
 *    tree: the version tree
 *    lastModified:last modified
 *    lastSynced: last sync time
 * }
 * @return synced version
 */
const mergeVersions = (local, remote) => {
  if (remote == null && local == null) return null;
  if (remote == null) {
    return {
      status: "local",
      tree: local.tree,
    };
  }
  if (local == null) {
    return {
      status: "remote",
      tree: remote.tree,
    };
  }
  //
  // now both side are non-null, in this case we only handle
  // two cases
  // - local root is part of the remote tree, and no local edit
  //   then we just take remote
  // - remote root is part of the local tree, and no remote edit
  //   then we just take local
  //
  const localTree = local.tree ? tm.parse(local.tree) : tm.parse(newNode());
  const remoteTree = remote.tree ? tm.parse(remote.tree) : tm.parse(newNode());

  const localRootId = localTree.model.id;
  const remoteNode = remoteTree.first(function(node) {
    return node.model.id === localRootId;
  });
  if (remoteNode != null) {
    if (remoteNode.isRoot()) {
      console.log("checking local modified time");
      if (!isModifiedAfterSync(local)) {
        return {
          status: "remote",
          tree: mergeTree(localTree, remoteTree),
        };
      }
      console.log("checking remote modified time");
      if (!isModifiedAfterSync(remote)) {
        return {
          status: "local",
          tree: mergeTree(localTree, remoteTree),
        };
      }
    } else {
      if (!isModifiedAfterSync(local)) {
        return {
          status: "remote",
          tree: mergeTree(localTree, remoteTree),
        };
      }
    }
    return {
      status: "conflict",
    };
  }

  const remoteRootId = remoteTree.model.id;
  const localNode = local.tree.first(function(node) {
    return node.model.id === remoteRootId;
  });
  if (localNode != null) {
    if (!isModifiedAfterSync(remote)) {
      return {
        status: "local",
        tree: mergeTree(local.tree, remote.tree),
      };
    }
    return {
      status: "conflict",
    };
  }

  return {
    status: "conflict",
  };
};

exports.mergeVersions = mergeVersions;
exports.newNode = newNode;
