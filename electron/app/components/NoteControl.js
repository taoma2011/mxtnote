/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { getTodoId } from '../utils/common';

export default class NoteControl extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const {
      noteTodoFilter,
      todos,
      filterChanged,
      importNoteFromRemote,
      importNote,
      exportNote,
      resetDb
    } = this.props;

    const selections = [];
    selections.push(
      <MenuItem key="item-none" value="none">
        None
      </MenuItem>
    );

    if (todos) {
      todos.forEach((t, index) => {
        const domKey = `selectitem-${index}`;
        selections.push(
          <MenuItem key={domKey} value={getTodoId(t)}>
            {t.description}
          </MenuItem>
        );
      });
    }

    return (
      <Grid container spacing={2}>
        <Grid item>
          <FormControl>
            <InputLabel id="input-label">Todo</InputLabel>
            <Select
              labelId="input-label"
              id="demo-simple-select"
              value={noteTodoFilter}
              onChange={filterChanged}
            >
              {selections}
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" onClick={importNoteFromRemote}>
            ImportRemote
          </Button>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" onClick={importNote}>
            Import
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={exportNote}>
            Export
          </Button>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" onClick={resetDb}>
            Reset Db
          </Button>
        </Grid>
      </Grid>
    );
  }
}
