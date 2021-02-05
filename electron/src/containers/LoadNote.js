import { connect } from 'react-redux';
import LoadNote from '../components/LoadNote';
import { ADD_NOTE_FROM_DB } from '../actions/file';

function mapDispatchToProps(dispatch) {
  return {
    addNotes: notes =>
      dispatch({
        type: ADD_NOTE_FROM_DB,
        notes
      })
  };
}

export default connect(null, mapDispatchToProps)(LoadNote);
