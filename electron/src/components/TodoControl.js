import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectTodos } from './selector';
import { addTodo } from '../features/todo/todoSlice';

// import TodoDependency from '../containers/TodoDependency';

export default function TodoControl(props) {
  // eslint-disable-next-line react/prop-types
  // const { addTodo, todos } = props;
  const todos = useSelector(selectTodos);
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAdd = () => {
    setOpen(false);
    dispatch(addTodo({ description }));
  };

  /*
  <TodoDependency initiallyChecked={[]} todos={todos} />
  */
  return (
    <Container>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Todo
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add TODO</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a TODO, enter description</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description"
            fullWidth
            onChange={handleDescriptionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
