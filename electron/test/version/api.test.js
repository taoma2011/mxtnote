var expect = require("chai").expect;
var mergeVersions = require("../version/version.js").mergeVersions;

var FlatToNested, flatToNested, flat;

FlatToNested = require("flat-to-nested");
flatToNested = new FlatToNested();

describe("description", function() {
  it("should have description", function() {
    expect(1 + 2).to.equal(3);
  });
});

describe("merge with one side empty", function() {
  it("merge with remote empty", function() {
    var local = {
      tree: flatToNested.convert([{ id: 1 }]),
      lastModified: null,
      syncTime: null,
    };
    var res = mergeVersions(local, null);
    expect(res).to.not.null;
  });
});
