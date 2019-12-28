import { connect } from 'react-redux';
import SelectRect from '../components/SelectRect';
import { SET_RECT_STATE } from '../actions/file';
import { getMainState } from '../reducers';
import { scaleRect } from '../utils/common';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const mainState = getMainState(state);
  const { scale, notes, editingNid, showSelection } = mainState;
  if (!showSelection) {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      angle: 0,
      hideSelection: true
    };
  }

  const scaledRect = scaleRect(notes[editingNid], scale / 100);
  return {
    ...scaledRect,
    hideSelection: !showSelection
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setRectState: rect => {
      const { top, left, width, height, angle } = rect;
      return dispatch({
        type: SET_RECT_STATE,
        top,
        left,
        width,
        height,
        angle
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectRect);
