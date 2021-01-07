const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron"); // Require Electron from the binaries included in node_modules.
const path = require("path");

describe("My Test App", function() {
  let app;
  this.timeout(20000);

  before(function() {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "../../app")],
    });

    //return this.app.start().catch(console.error);
    return this.app.start();
  });

  after(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it("Should have the correct title", async function() {
    // actual test
    const title = await this.app.client.getTitle();
    assert.equal(title, "My Test App");
  });
});
