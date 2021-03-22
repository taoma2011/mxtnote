var expect = require('chai').expect;
var mergeVersions = require('../../src/version/version.js').mergeVersions;

var FlatToNested, flatToNested, flat;

FlatToNested = require('flat-to-nested');
flatToNested = new FlatToNested();

describe('merge with one side empty', function () {
  it('merge with remote empty', function () {
    const date1 = Date.now();
    const localVersion = {
      tree: flatToNested.convert([{ id: 1 }]),
      lastModified: date1,
      syncTime: date1,
    };
    var res = mergeVersions(localVersion, null);
    expect(res).to.not.null;
  });

  it('merge with both side same version', function () {
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
    expect(res).to.have.property('status', 'remote');
    res = mergeVersions(version2, version1);
    expect(res).to.not.null;
    expect(res).to.have.property('status', 'local');
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

*/
