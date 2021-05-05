/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import { selectNoteById, selectTodos } from './selector';

export default function DependencyChips(props) {
  // eslint-disable-next-line react/prop-types
  const { noteId } = props;
  const note = useSelector(selectNoteById(noteId));
  const todos = useSelector(selectTodos);
  if (!note) return null;
  const dep = note.todoDependency || [];
  // get the todo names
  const dependencies = dep.map((d) => {
    return todos.map((t) => {
      return d === t.id ? t.description : null;
    });
  });

  const chips = [];
  dependencies.forEach((d, index) => {
    const domKey = `chip-${index}`;
    chips.push(<Chip label={d} key={domKey} />);
  });
  return <div> {chips}</div>;
}
