var expect = require("chai").expect;
var mergeVersions = require("../../version/version.js").mergeVersions;

var FlatToNested, flatToNested, flat;

FlatToNested = require("flat-to-nested");
flatToNested = new FlatToNested();

describe("merge with one side empty", function() {
  it("merge with remote empty", function() {
    const date1 = Date.now();
    const localVersion = {
      tree: flatToNested.convert([{ id: 1 }]),
      lastModified: date1,
      syncTime: date1,
    };
    var res = mergeVersions(localVersion, null);
    expect(res).to.not.null;
  });

  it("merge with both side same version", function() {
    const date1 = new Date();
    const date2 = new Date(date1.getTime() + 60000);
    const version1 = {
      tree: flatToNested.convert([{ id: 1 }]),
      lastModified: date1,
      lastSynced: date1,
    };
    const version2 = {
      tree: flatToNested.convert([{ id: 1 }]),
      lastModified: date2,
      lastSynced: date1,
    };
    let res;
    res = mergeVersions(version1, version2);
    expect(res).to.not.null;
    expect(res).to.have.property("status", "remote");
    res = mergeVersions(version2, version1);
    expect(res).to.not.null;
    expect(res).to.have.property("status", "local");
  });
});
