require = require("esm")(module);

const { TestInitDb, GetAllDocumentsPromise } = require("../../app/utils/db.js");
const { importRemoteDb, login } = require("../../app/utils/api.js");
const { app } = require("electron");

describe("test db", function() {
  before(async function() {
    TestInitDb();
    //useNetFromNode();
    await app.whenReady();
  });

  after(function() {});

  it("get all document", async function() {
    // actual test
    const allDoc = await GetAllDocumentsPromise();
    console.log("all doc is ", allDoc);
  });

  it("calls import", async function() {
    // actual test
    const allDoc = await GetAllDocumentsPromise();
    console.log("all doc is ", allDoc);
    const loginResult = await login({
      username: process.env.TEST_USER,
      password: process.env.TEST_PASSWORD,
    });
    console.log("log in result is ", loginResult);
    const importResult = await importRemoteDb(null, allDoc);
    console.log("import result is ", importResult);
  });
});
