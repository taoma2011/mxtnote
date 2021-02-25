import axios from 'axios';

const token = null;

const BASE_URL = 'https://note.mxtsoft.com:4001';
const TEST_BASE_URL = 'http://localhost:4001';

const getBaseUrl = () => {
  return BASE_URL;
};

export const ServerInitialize = () => {
  // check if we have saved token
  return 'login-needed';
};

export const ServerLogin = () => {
  const user = process.env.TEST_USER;
  const pass = process.env.TEST_PASS;
  const res = axios.post(`${getBaseUrl()}/users/authenticate`, {
    username: user,
    password: pass,
  });
  console.log('login get ', res);
  return true;
};
