import Root from './src/containers/Root';
import { configureStore } from './src/store/configureStore';
import { InitDb } from './src/utils/db';
import { setDataApiType, setWebApp } from './src/reducers/file';

export { Root, configureStore, InitDb, setDataApiType, setWebApp };
