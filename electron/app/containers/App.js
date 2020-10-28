/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import FilePage from "./FilePage";
import NotePage from "./NotePage";
import LoadLibrary from "./LoadLibrary";
import LoadTodo from "./LoadTodo";
import LibraryPage from "./LibraryPage";
import TodoPage from "./TodoPage";
import { SET_TAB, NOTE_TAB, LIBRARY_TAB, TODO_TAB } from "../actions/file";
import { getElectron } from "../utils/common";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: `#663399`,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    marginTop: 30,
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

function TabPanel(props) {
  // eslint-disable-next-line react/prop-types
  const { children, value, index, ...other } = props;
  /*
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
  */
  if (value === index) return <>{children}</>;
  return null;
}

function App(props) {
  const classes = useStyles();

  // eslint-disable-next-line react/prop-types
  const { libraryLoaded, todoLoaded, currentTab, setTab } = props;
  console.log("current tab = ", currentTab);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const setLibraryTab = () => {
    setTab(LIBRARY_TAB);
  };

  const setNoteTab = () => {
    setTab(NOTE_TAB);
  };

  const setTodoTab = () => {
    setTab(TODO_TAB);
  };

  const { app } = getElectron();
  return (
    <div className={classes.root}>
      <CssBaseline />
      {!libraryLoaded && <LoadLibrary />}
      {!todoLoaded && <LoadTodo />}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography
            style={{ flex: 1 }}
            variant="h6"
            className={classes.title}
          >
            MxtNote
          </Typography>
          <Typography>{app.getVersion()}</Typography>

          <Tabs
            value={currentTab}
            onChange={handleChange}
            aria-label="simple tabs example"
          />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List variant="primary">
          <ListItem
            button
            selected={currentTab === LIBRARY_TAB}
            key="library"
            onClick={setLibraryTab}
          >
            <ListItemText primary="Library" />
          </ListItem>
          <ListItem
            button
            selected={currentTab === TODO_TAB}
            key="todo"
            onClick={setTodoTab}
          >
            <ListItemText primary="Todo" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key="note"
            selected={currentTab === NOTE_TAB}
            onClick={setNoteTab}
          >
            <ListItemText primary="Note" />
          </ListItem>
        </List>
      </Drawer>

      <main className={classes.content} style={{ height: "100vh" }}>
        <div className={classes.toolbar} style={{ height: "100vh" }}>
          <TabPanel value={currentTab} index={0}>
            <FilePage />
          </TabPanel>
          <TabPanel value={currentTab} index={1} style={{ height: "100vh" }}>
            <NotePage />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <LibraryPage />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <TodoPage />
          </TabPanel>
        </div>
      </main>
    </div>
  );
}

function mapStateToProps(state) {
  const { file } = state;
  const { currentTab, libraryLoaded, todoLoaded } = file || {};

  return {
    currentTab: currentTab || 0,
    libraryLoaded,
    todoLoaded,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTab: (tab) => {
      return dispatch({
        type: SET_TAB,
        tab,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
