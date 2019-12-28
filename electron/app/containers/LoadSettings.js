import { connect } from 'react-redux';
import LoadSettings from '../components/LoadSettings';
import { GetSettings } from '../utils/db';
import { SCALE_CHANGED } from '../actions/file';

function asyncLoadSettings() {
  return dispatch => {
    console.log('111');
    return GetSettings().then(settings => {
      console.log('got settings ', settings);
      if (settings.scale) {
        dispatch({ type: SCALE_CHANGED, scale: settings.scale });
      }
      return true;
    });
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadSettings: () => dispatch(asyncLoadSettings())
  };
}

export default connect(null, mapDispatchToProps)(LoadSettings);
