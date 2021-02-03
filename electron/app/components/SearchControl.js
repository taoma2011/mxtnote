import React from "react";
import { useDispatch } from "react-redux";
import InputBase from "@material-ui/core/InputBase";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { searchTextInDoc } from "../features/search/searchSlice";

export const SearchControl = (props) => {
  const { doc } = props;
  const [searchText, setSearchText] = React.useState("");
  const textChanged = (event) => {
    setSearchText(event.target.value);
  };
  const dispatch = useDispatch();
  const doSearch = () => {
    dispatch(
      searchTextInDoc({
        searchText,
        doc,
      })
    );
  };
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
