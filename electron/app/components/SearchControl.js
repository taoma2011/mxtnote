import React from "react";

import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

export const SearchControl = (props) => {
  const { doc } = props;
  const [searchText, setSearchText] = React.useState("");
  const textChanged = (event) => {
    setSearchText(event.target.value);
  };

  const doSearch = () => {};
  return (
    <Grid container spacing={2}>
      <Grid item>
        <InputBase
          placeholder="Search Text"
          inputProps={{ "aria-label": "search text" }}
          onChange={textChanged}
        />
      </Grid>
      <Grid item>
        <IconButton type="submit" aria-label="clear" onClick={doSearch}>
          <SearchIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};
