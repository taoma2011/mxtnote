import Root from './src/containers/Root';
import { configureStore } from './src/store/configureStore';
import { InitDb } from './src/utils/db';
import { setUseLocalDataApi, setWebApp } from './src/reducers/file';

export { Root, configureStore, InitDb, setUseLocalDataApi, setWebApp };
