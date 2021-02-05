import { connect } from "react-redux";
import BackupDb from "../components/BackupDb";
import { BACKUP_DB } from "../actions/file";

function mapDispatchToProps(dispatch) {
  return {
    backupDb: () =>
      dispatch({
        type: BACKUP_DB
      })
  };
}

export default connect(null, mapDispatchToProps)(BackupDb);
