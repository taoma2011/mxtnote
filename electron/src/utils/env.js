let useLocalDataApi = false;
export function setUseLocalDataApi(b) {
  console.log('set use local data api to ', b);
  useLocalDataApi = b;
}
export function isUseLocalDataApi() {
  return useLocalDataApi;
}
let isWeb = false;
export function setWebApp(b) {
  isWeb = b;
}
export function isWebApp() {
  return isWeb;
}

let initialToken;
export function setInitialToken(t) {
  initialToken = t;
}
export function getInitialToken() {
  return initialToken;
}
