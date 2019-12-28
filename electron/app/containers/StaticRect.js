import { connect } from 'react-redux';
import StaticRect from '../components/StaticRect';
import { EDIT_NOTE } from '../actions/file';
import { scaleRect } from '../utils/common';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state, ownProps) {
  const { file } = state;
  const { notes, scale } = file || {};
  console.log('notes = ', notes);
  console.log('nid = ', ownProps);
  console.log('editingNid is ', file.editingNid);
  const disableClick = Boolean(file.editingNid);
  if (notes) {
    const note = notes[ownProps.nid];
    const scaledRect = scaleRect(note, scale / 100);
    return {
      disableClick,
      ...note,
      ...scaledRect
    };
  }
  return { visible: false };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    editNote: () => {
      return dispatch({
        type: EDIT_NOTE,
        nid: ownProps.nid
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StaticRect);
