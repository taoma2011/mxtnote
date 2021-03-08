import { connect } from 'react-redux';
import DependencyChips from '../components/DependencyChips';
import { getTodoId } from '../utils/common';

// obsolete
// eslint-disable-next-line no-unused-vars
function mapStateToProps(state, ownProp) {
  const { file } = state;
  const { notes, todos } = file || {};
  const note = notes[ownProp.context];
  const dep = (note || {}).todoDependency || [];
  // get the todo names
  const depNames = dep.map((d) => {
    return todos.map((t) => {
      return d === getTodoId(t) ? t.description : null;
    });
  });
  return {
    dependencies: depNames,
  };
}

export default connect(mapStateToProps, null)(DependencyChips);
