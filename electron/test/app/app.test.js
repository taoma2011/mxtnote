const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron"); // Require Electron from the binaries included in node_modules.
const path = require("path");

describe("My Test App", function() {
  this.timeout(10000);

  before(function() {
    const appDir = path.join(__dirname, "../../app");
    console.log("appDir is ", appDir);
    this.app = new Application({
      path: electronPath,
      args: [appDir],
      port: 9888,
      chromeDriverLogPath: "chrome.log",
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
    assert.equal(title, "MxtNote");
  });

  it("test login api", async function() {
    console.log("before call invoke");
    const result = await this.app.electron.ipcRenderer.invoke("login-api", {
      username: "tao",
      password: "tt",
    });
    console.log("result is ", result);
  });
});
