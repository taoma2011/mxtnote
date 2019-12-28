import { connect } from 'react-redux';
import LibraryPage from '../components/LibraryPage';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file } = state;
  const { libraryLoaded, settingsLoaded, noteLoaded } = file || {};
  // console.log('library loaded: ', libraryLoaded);
  return { libraryLoaded, settingsLoaded, noteLoaded };
}

export default connect(mapStateToProps, null)(LibraryPage);
