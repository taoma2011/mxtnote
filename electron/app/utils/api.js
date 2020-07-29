const AWS_URL = "http://note.mxtsoft.com:4000"

export const login = (args) => new Promise((resolve, reject) => {

    const { net } = require('electron');
    const postData = JSON.stringify(args);
    console.log("post data ", postData);
    const request = net.request({
        method: "POST", url: AWS_URL + "/users/authenticate",
    });
    request.setHeader('Content-Type', 'application/json');
    //request.setHeader('Content-Length', postData.length.toString());
    /*
      headers: {
            
            'Content-Length': postData.length
        }
        */
    request.on('response', (response) => {
        console.log("response is ", response);
        if (response.statusCode != 200) {
            reject("error");
        }
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            resolve(new TextDecoder("utf-8").decode(chunk));
        })

    });
    request.write(postData);

    request.end()
})

export const startIpcMain = () => {
    const { ipcMain } = require('electron');
    ipcMain.handle('login-api', async (event, args) => {
        console.log(args);
        const response = await login(args);
        return response;
    });
}

export const callLogin = (username, password) => {
    const { ipcRenderer } = require('electron');
    ipcRenderer.invoke('login-api', {
        username: username,
        password: password
    }).then((result) => {
        console.log("result: ", result);
    });
}
