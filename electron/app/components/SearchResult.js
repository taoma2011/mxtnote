import React from "react";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { selectAllSearchResult } from "../features/search/searchSlice";

export const SearchResult = () => {
  const results = useSelector(selectAllSearchResult);
  const close = () => {};
  return (
    <>
      <IconButton type="submit" aria-label="clear" onClick={close}>
        <CloseIcon />
      </IconButton>

      <List dense={true}>
        {results.map((r, index) => (
          <ListItem key={`sr-${index}`}>
            <ListItemText primary={`${r.text}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};
