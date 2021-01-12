var expect = require("chai").expect;
var mergeVersions = require("../../version/version.js").mergeVersions;

var FlatToNested, flatToNested;

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

/*
 * example output of /db
{
  files: [
    {
      username: 'tao',
      filename: 'berger',
      userId: '5ff94d0522a013489a276c5b',
      createdDate: '2021-01-09T06:28:21.940Z',
      fileUuid: '5ff94d0522a013489a276c5c',
      height: 792,
      numPages: 22,
      originalDevice: 'a5c556fd851f4f5988e185d7cf469341607d74fcb5ed56c0116a7c2e55488e6b:xtserver',
      size: 249375,
      width: 612,
      id: '5ff94d0522a013489a276c5c'
    }
  ],
  notes: [],
  tags: []
}

example note:
 {
      tags: [],
      userId: '5ef8603500d4e368b5b3eba4',
      fileId: '5f5eb52a2b1de3001c3d9941',
      page: 11,
      pageX: 0.4863417699555785,
      pageY: 0.3688892954091527,
      width: 0.8351851851851838,
      height: 0.1045370370370369,
      detail: 'horizontal section',
      lastModifiedTime: '2020-12-11T20:14:09.624Z',
      creationTime: '2020-09-13T18:44:11.265Z',
      hasMathSymbol: false,
      noteUuid: '5f5ecaec2b1de3001c3d9945',
      originalDevice: '962f496a15ebae6bffb3b52414def99c3ec2f7fac587c4e18700cc486e54c323:xtserver',
      lastSynced: '2021-01-12T03:15:19.217Z',
      syncRecord: '{"id":"17d5e5da-99f3-4a15-af5c-7a0419e25310"}',
      id: '5f5ecaec2b1de3001c3d9945'
    },

    example tag:
      {
      members: [],
      userId: '5ef8603500d4e368b5b3eba4',
      name: 'p adic hodge',
      createdDate: '2020-07-19T02:57:58.061Z',
      id: '5f13b6b6f7008b5f1b782352'
    },

*/
