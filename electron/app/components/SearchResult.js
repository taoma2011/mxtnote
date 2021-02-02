import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

export const SearchResult = (props) => {
  const { results } = props;
  return (
    <>
      <IconButton type="submit" aria-label="clear" onClick={doSearch}>
        <CloseIcon />
      </IconButton>

      <List dense={true}>
        {results.map((r, index) => {
          return (
            <ListItem>
              <ListItemText primary=`${r.text}` />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
