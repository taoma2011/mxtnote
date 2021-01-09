const { TestInitDb, GetAllDocumentsPromise } = require("../../app/utils/db.js");

describe("test db", function() {
  before(function() {
    TestInitDb();
  });

  after(function() {});

  it("get all document", async function() {
    // actual test
    const allDoc = await GetAllDocumentsPromise();
    console.log("all doc is ", allDoc);
  });
});
