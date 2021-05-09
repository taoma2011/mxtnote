import React, { useEffect } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { SET_API_STATE } from '../actions/file';
import { GetSettings } from '../utils/db';

const selector = (state) => {
  return {
    dataApi: state.file.dataApi,
    apiState: state.file.apiState,
  };
};

export const AutoLogin = () => {
  const { dataApi, apiState } = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (apiState === 'login-needed') {
      GetSettings()
        .then((settings) => {
          console.log('settings is ', settings);
          if (settings && settings.user && settings.password) {
            console.log(
              `auto login with ${settings.user}, ${settings.password}`
            );
            return dataApi.Login(settings.user, settings.password);
          }
          return false;
        })
        .then((ret) => {
          if (ret) {
            dispatch({
              type: SET_API_STATE,
              apiState: 'initialized',
            });
          }
          return true;
        })
        .catch(() => {});
    }
  }, [apiState]);
  return null;
};

export default AutoLogin;
